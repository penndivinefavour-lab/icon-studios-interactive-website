import type { AiAction, Intent, ConversationMessage } from './schema';
import { projects, services } from '@/lib/data/content';
import { iconKnowledge } from '@/lib/ai/knowledge';

export type { ConversationMessage };

type DetectIntentResult = {
  intent: Intent;
  confidence: number;
};

export function detectIntent(message: string): DetectIntentResult {
  const text = message.toLowerCase();

  const intents: { intent: Intent; patterns: RegExp[]; weight: number }[] = [
    {
      intent: 'ABOUT_ICON',
      weight: 1,
      patterns: [
        /about\s+icon/,
        /who\s+are\s+you/,
        /what\s+is\s+icon/,
        /tell\s+me\s+about\s+the\s+studio/,
        /icon\s+studios/,
      ],
    },
    {
      intent: 'SITE_TOUR',
      weight: 1,
      patterns: [/tour/, /guide\s+me/, /walk\s+me\s+through/, /show\s+me\s+around/],
    },
    {
      intent: 'PROJECT_DETAILS',
      weight: 1,
      patterns: [
        /tell\s+me\s+more\s+about\s+.+/,
        /details\s+on\s+.+/,
        /more\s+info\s+on\s+.+/,
        /explain\s+.+/,
      ],
    },
    {
      intent: 'PROJECT_DISCOVERY',
      weight: 0.8,
      patterns: [
        /projects?/,
        /work\s+you'?ve\s+done/,
        /show\s+me\s+.+\s+projects?/,
        /ai\s+project/,
        /automation\s+project/,
        /creative\s+project/,
      ],
    },
    {
      intent: 'SERVICES',
      weight: 0.9,
      patterns: [
        /services?/,
        /capabilities/,
        /what\s+do\s+you\s+offer/,
        /how\s+can\s+you\s+help/,
        /startup/,
      ],
    },
    {
      intent: 'TECHNOLOGY',
      weight: 0.8,
      patterns: [
        /technolog/,
        /stack/,
        /built\s+with/,
        /tools\s+you\s+use/,
        /framework/,
      ],
    },
    {
      intent: 'CONTACT',
      weight: 0.9,
      patterns: [
        /contact/,
        /hire/,
        /work\s+together/,
        /collaborate/,
        /reach\s+you/,
      ],
    },
    {
      intent: 'GENERAL_QUESTION',
      weight: 0.5,
      patterns: [/^(hi|hello|hey|yo|greetings)/i, /\?$/],
    },
  ];

  let bestMatch = { intent: 'UNKNOWN' as Intent, confidence: 0 };

  for (const candidate of intents) {
    for (const pattern of candidate.patterns) {
      if (pattern.test(text)) {
        const confidence = candidate.weight;
        if (confidence > bestMatch.confidence) {
          bestMatch = { intent: candidate.intent, confidence };
        }
        break;
      }
    }
  }

  return bestMatch;
}

function findProject(message: string) {
  const text = message.toLowerCase();
  const match = projects.find(
    (project) =>
      text.includes(project.slug) ||
      text.includes(project.title.toLowerCase()) ||
      project.technologies.some((tech) => text.includes(tech.toLowerCase()))
  );
  return match;
}

function findService(message: string) {
  const text = message.toLowerCase();
  return services.find((service) => text.includes(service.title.toLowerCase()));
}

export function buildAiResponse(
  message: string,
  context?: { currentPath?: string; currentProjectSlug?: string }
): { text: string; actions?: AiAction[] } {
  const intentResult = detectIntent(message);
  const currentProject = context?.currentProjectSlug
    ? projects.find((project) => project.slug === context.currentProjectSlug)
    : undefined;

  if (intentResult.intent === 'ABOUT_ICON') {
    const entry = iconKnowledge.find((item) => item.id === 'identity');
    return {
      text: entry?.content ??
        'ICON Studios builds intelligent digital products, AI systems, automation, and creative technology.',
      actions: [{ type: 'navigate', href: '/about' }],
    };
  }

  if (intentResult.intent === 'PROJECT_DISCOVERY') {
    const matched = findProject(message);
    if (matched) {
      return {
        text: `${matched.title} is a ${matched.status.replace('-', ' ')} ${matched.category} project. ${matched.shortDescription}`,
        actions: [{ type: 'open_project', slug: matched.slug }],
      };
    }
    return {
      text: 'ICON Studios works across AI, creative, automation, and platform projects. Here are a few starting points.',
      actions: [{ type: 'navigate', href: '/projects' }],
    };
  }

  if (intentResult.intent === 'PROJECT_DETAILS') {
    if (currentProject) {
      return {
        text: `${currentProject.title}: ${currentProject.fullDescription}. Technologies include ${currentProject.technologies.join(', ')}.`,
        actions: [
          { type: 'open_project', slug: currentProject.slug },
          { type: 'navigate', href: '/projects' },
        ],
      };
    }
    const matched = findProject(message);
    if (matched) {
      return {
        text: `${matched.title}: ${matched.fullDescription}. Technologies include ${matched.technologies.join(', ')}.`,
        actions: [{ type: 'open_project', slug: matched.slug }],
      };
    }
    return {
      text: 'I can explain specific projects if you name one, or I can take you to the projects list.',
      actions: [{ type: 'navigate', href: '/projects' }],
    };
  }

  if (intentResult.intent === 'SERVICES') {
    const matched = findService(message);
    if (matched) {
      return {
        text: `${matched.title}: ${matched.description} Capabilities include ${matched.capabilities.join(', ')}.`,
        actions: [{ type: 'navigate', href: '/services' }],
      };
    }
    return {
      text: 'ICON Studios provides services across AI, automation, creative, and platform work. I can take you to the services overview.',
      actions: [{ type: 'navigate', href: '/services' }],
    };
  }

  if (intentResult.intent === 'TECHNOLOGY') {
    const allTech = Array.from(new Set(projects.flatMap((project) => project.technologies))).slice(0, 12);
    return {
      text: `ICON Studios uses modern web, AI, and automation tooling. Representative technologies include ${allTech.join(', ')}.`,
      actions: [{ type: 'navigate', href: '/projects' }],
    };
  }

  if (intentResult.intent === 'CONTACT') {
    return {
      text: 'You can reach ICON Studios through the contact page. I can take you there now.',
      actions: [{ type: 'navigate', href: '/contact' }],
    };
  }

  if (intentResult.intent === 'SITE_TOUR') {
    return {
      text: 'I can guide you through the site: introduction, selected work, capabilities, experience, services, and contact. Starting the tour now.',
      actions: [{ type: 'start_tour' }],
    };
  }

  if (intentResult.intent === 'GENERAL_QUESTION') {
    return {
      text: 'I can explain ICON Studios, show projects or services, or guide you through the site. What would you like?',
      actions: [
        { type: 'navigate', href: '/projects' },
        { type: 'navigate', href: '/services' },
        { type: 'navigate', href: '/about' },
      ],
    };
  }

  return {
    text: "I don't have that information in the ICON Studios knowledge base yet. I can help with projects, services, the studio background, or a guided tour.",
    actions: [
      { type: 'navigate', href: '/projects' },
      { type: 'navigate', href: '/about' },
      { type: 'start_tour' },
    ],
  };
}

export function getSuggestedPrompts(currentPath?: string): string[] {
  if (currentPath?.startsWith('/projects/')) {
    return ['Tell me more about this project.', 'Show related projects.', 'What technologies does this use?'];
  }

  if (currentPath === '/services') {
    return ['Which service suits a startup?', 'What automation work exists?', 'Show relevant projects.'];
  }

  if (currentPath === '/experience') {
    return ['Give me a tour.', 'What AI work has ICON done?', 'Show projects.'];
  }

  return [
    'What does ICON Studios build?',
    'Show me the projects.',
    'Which project uses AI?',
    'Give me a tour.',
    'How could ICON help my business?',
  ];
}

export function createConversationService() {
  return {
    detectIntent,
    buildAiResponse,
    getSuggestedPrompts,
  };
}
