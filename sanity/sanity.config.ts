import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'vsmgrowth',
  title: 'VSM website',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'REPLACE_ME',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
