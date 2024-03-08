import Head from 'next/head';
import { ToolsProvider } from '@/hooks/useTools'

import { TagsSection } from './components/tags-section';
import { ToolsSection } from './components/tools-section';

const Home: React.FC = () => {
  return (
    <ToolsProvider>
      <div className="flex flex-col lg:flex-row bg-gray-800 text-white min-h-screen">
        <Head>
          <title>pintech</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://cdn.tailwindcss.com" rel="stylesheet" />
        </Head>

        <TagsSection />

        <ToolsSection
        />
      </div>
    </ToolsProvider>
  );
};

export default Home;
