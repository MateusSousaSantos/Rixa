import React, { useState } from "react";
import { Post } from "./posts/NormalPost";
import { DebatePost } from "./posts/DebatePost";
import { PoolPost } from "./posts/PoolPost";
import type { PostType } from "../components/posts/index";
import { FaSearch } from "react-icons/fa";
export const HomeView: React.FC = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: 2,
      author: "Bob",
      content: "What do you think about the new social media regulations?",
      timestamp: "5 hours ago",
      type: "debate",
      topic: "Social Media Regulations",
      sides: {
        pro: { votes: 50000, arguments: ["Better privacy protection", "Reduced misinformation"], name: "A favor" },
        con: { votes: 10000, arguments: ["Limits free speech", "Government overreach"], name: "Contra" }
      }
    },
    {
      id: 3,
      author: "Charlie",
      content: "Where should we go for our next team lunch?",
      timestamp: "1 day ago",
      type: "pool",
      question: "Best lunch spot?",
      options: [
        { id: 1, text: "Italian Restaurant", votes: 8 },
        { id: 2, text: "Sushi Bar", votes: 12 },
        { id: 3, text: "Mexican Grill", votes: 5 }
      ]
    }
  ]);

  const popularTags = ["Debate", "Enquete", "Notícias", "Tech", "Política", "Esportes", "Música", "Arte"];

  const SearchBar = () => {
    return (
      <div className="sticky top-0 z-10 w-full bg-rixa-dark shadow-sm border-b border-rixa-blue/20 p-2 mb-4">
        <div className="bg-rixa-dark-shadow rounded-lg">
          <div className="flex items-center space-x-2 px-4 py-1">
            <FaSearch color="669BBC" size={25} />
            <input
              type="text"
              className="w-full p-1 text-rixa-blue font-bold bg-transparent border-2 border-none rounded-lg focus:outline-none focus:border-rixa-cream/50 text-lg"
              placeholder="Pesquisar"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
            <p className="text-rixa-blue font-bold text-lg">\</p>
          </div>
          
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${searchFocused 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0'
            }
          `}>
            <div className="px-4 pb-2 mt-3 border-t border-rixa-blue/20 pt-3 ">
              <div className="mb-3">
                <p className="text-rixa-cream font-semibold text-sm mb-2">Tags populares:</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-rixa-blue/20 text-rixa-blue rounded-full text-sm cursor-pointer hover:bg-rixa-cream/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-rixa-cream text-rixa-dark rounded-lg font-bold text-sm hover:bg-rixa-blue ">
                  Busca avançada
                </button>
                <button className="px-3 py-1 bg-rixa-cream text-rixa-dark rounded-lg font-bold text-sm hover:bg-rixa-blue ">
                  Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RenderPost = ({ post }: { post: PostType }) => {
    switch (post.type) {
      case 'normal':
        return (
          <Post
            key={post.id}
            author={post.author}
            content={post.content}
            timestamp={post.timestamp}
          />
        );
      case 'debate':
        return (
          <DebatePost
            key={post.id}
            author={post.author}
            content={post.content}
            timestamp={post.timestamp}
            topic={post.topic}
            sides={post.sides}
          />
        );
      case 'pool':
        return (
          <PoolPost
            key={post.id}
            author={post.author}
            content={post.content}
            timestamp={post.timestamp}
            question={post.question}
            options={post.options}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <SearchBar />
      <div
        className="flex-1 overflow-y-auto px-5 space-y-4 
                   scrollbar-thin scrollbar-track-rixa-dark 
                   scrollbar-thumb-rixa-blue hover:scrollbar-thumb-rixa-cream
                   scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
      >
        {posts.map((post) => (
          <RenderPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};