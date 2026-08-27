export type ResourceCategory = 'visual' | 'content' | 'motion' | 'engineering';

export type ResourceSubcategory =
  | 'ui-inspiration'
  | 'component-libraries'
  | 'stock-media'
  | 'icons'
  | 'illustrations'
  | 'fonts'
  | 'color-tools'
  | 'copywriting'
  | 'placeholder-data'
  | 'structure-wireframes'
  | 'animation-libraries'
  | 'lottie-assets'
  | 'micro-interactions'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'deployment'
  | 'auth-tools';

export interface ResourceItem {
  id: string;
  name: string;
  url: string;
  category: ResourceCategory;
  subcategory: ResourceSubcategory;
  description: string;
  freeTier: string;
  licenseNotice: string;
  tags: string[];
  recommendedFor?: {
    stacks?: string[];
    visuals?: string[];
    tones?: string[];
  };
}

export interface ResourceFilter {
  category?: ResourceCategory;
  subcategory?: ResourceSubcategory;
  search?: string;
  tag?: string;
  stack?: string;
  visual?: string;
}

export interface CategoryMetadata {
  id: ResourceCategory;
  name: string;
  emoji: string;
  description: string;
  subcategories: {
    id: ResourceSubcategory;
    name: string;
    description: string;
  }[];
}
