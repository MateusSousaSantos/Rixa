import React, { useState, useRef, useEffect } from "react";
import { Post } from "./posts/NormalPost";
import { DebatePost } from "./posts/DebatePost";
import { PoolPost } from "./posts/PoolPost";
import type { PostType } from "../components/posts/index";
import type { NavigationView, PostDetailsState } from "../types/navigation";
import { FaSearch } from "react-icons/fa";
import { usePosts, useSearchPosts } from "../hooks";

interface HomeViewProps {
  onPostClick?: (view: NavigationView, postDetails?: PostDetailsState) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onPostClick }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Use React Query for posts
  const { 
    data: posts = [], 
    isLoading: loadingPosts, 
    error: postsError 
  } = usePosts(1, 10, sortBy);

  // Use React Query for search
  const { 
    data: searchResults = [], 
    isLoading: loadingSearch, 
    error: searchError 
  } = useSearchPosts(searchQuery, searchQuery.trim().length > 0);

  // Determine which data to use
  const displayPosts = searchQuery.trim().length > 0 ? searchResults : posts;
  const loading = searchQuery.trim().length > 0 ? loadingSearch : loadingPosts;
  const error = searchQuery.trim().length > 0 ? searchError : postsError;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // React Query will automatically handle the search when searchQuery changes
  };

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCommentClick = (post: PostType) => {
    if (onPostClick) {
      const postDetails: PostDetailsState = {
        postId: post.id,
        postType: post.type,
        author: post.author,
        content: post.content,
        timestamp: post.timestamp,
      };
      onPostClick('post-details', postDetails);
    }
  };

  const popularTags = ["Debate", "Enquete", "Notícias", "Tech", "Política", "Esportes", "Música", "Arte"];
  
  // ...existing SearchBar component...
  const SearchBar = () => {
    return (
      <div className="sticky top-0 z-10 w-full bg-rixa-dark shadow-sm border-b border-rixa-blue/20 p-2 mb-4">
        <div ref={searchBarRef} className="bg-rixa-dark-shadow rounded-lg">
          <div className="flex items-center space-x-2 px-4 py-1">
            <FaSearch color="669BBC" size={25} />
            <input
              type="text"
              className="w-full p-1 text-rixa-blue font-bold bg-transparent border-2 border-none rounded-lg focus:outline-none focus:border-rixa-cream/50 text-lg"
              placeholder="Pesquisar"
              value={searchQuery}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              onFocus={() => setSearchFocused(true)}
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
                      onClick={() => {
                        setSearchQuery(`#${tag}`);
                        handleSearch(`#${tag}`);
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-rixa-cream text-rixa-dark rounded-lg font-bold text-sm hover:bg-rixa-blue">
                  Busca avançada
                </button>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'trending')}
                  className="px-3 py-1 bg-rixa-cream text-rixa-dark rounded-lg font-bold text-sm hover:bg-rixa-blue"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="popular">Mais populares</option>
                  <option value="trending">Em alta</option>
                </select>
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
            onCommentClick={() => handleCommentClick(post)}
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
            onCommentClick={() => handleCommentClick(post)}
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
            onCommentClick={() => handleCommentClick(post)}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <SearchBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-rixa-cream">Carregando posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <SearchBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-rixa-red">{error?.message || 'Erro ao carregar dados'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <SearchBar />
      <div
        className="flex-1 overflow-y-auto px-5 space-y-4 
                   scrollbar-thin scrollbar-track-rixa-dark 
                   scrollbar-thumb-rixa-blue hover:scrollbar-thumb-rixa-cream
                   scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
      >
        {displayPosts.length === 0 ? (
          <div className="text-center py-12 text-rixa-cream/60">
            {searchQuery ? 'Nenhum post encontrado para sua busca.' : 'Nenhum post disponível.'}
          </div>
        ) : (
          displayPosts.map((post) => (
            <RenderPost key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};