import React, { useState, useRef, useEffect } from "react";
import { Post } from "../posts/NormalPost";
import { DebatePost } from "../posts/DebatePost";
import type { PostType } from "../posts/index";
import type { NavigationView, PostDetailsState, UserProfileState } from "../../types/navigation";
import { FaSearch, FaTimes } from "react-icons/fa";
import { usePosts, useSearchPosts } from "../../hooks";

interface HomeViewProps {
  onPostClick?: (view: NavigationView, postDetails?: PostDetailsState) => void;
  onUserClick?: (view: NavigationView, userDetails?: UserProfileState) => void;
}

interface SearchBarProps {
  searchQuery: string;
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  searchBarRef: React.RefObject<HTMLDivElement | null>;
  handleSearch: (query: string) => void;
  handleHashtagClick: (tag: string) => void;
  clearSearch: () => void;
  sortBy: 'newest' | 'popular' | 'trending';
  setSortBy: (sortBy: 'newest' | 'popular' | 'trending') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  searchFocused,
  setSearchFocused,
  searchBarRef,
  handleSearch,
  handleHashtagClick,
  clearSearch,
  sortBy,
  setSortBy
}) => {
  const popularTags = ["Debate", "Notícias", "Tech", "Política", "Esportes", "Música", "Arte"];
  
  return (
    <div className="sticky top-0 z-10 w-full bg-rixa-dark shadow-sm border-b border-rixa-blue/20 p-2 mb-4">
      <div ref={searchBarRef} className="bg-rixa-dark-shadow rounded-lg">
        <div className="flex items-center space-x-2 px-4 py-1">
          <FaSearch color="669BBC" size={25} />
          <input
            type="text"
            className="w-full p-1 text-rixa-blue font-bold bg-transparent border-2 border-none rounded-lg focus:outline-none focus:border-rixa-cream/50 text-lg"
            placeholder="Pesquisar (#hashtag, @usuario)"
            value={searchQuery}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            onFocus={() => setSearchFocused(true)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-rixa-blue hover:text-rixa-cream transition-colors"
              aria-label="Limpar busca"
            >
              <FaTimes size={16} />
            </button>
          )}
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
                    onClick={() => handleHashtagClick(tag)}
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

export const HomeView: React.FC<HomeViewProps> = ({ onPostClick, onUserClick }) => {
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
    // Auto-focus search if it's a hashtag search
    if (query.startsWith('#')) {
      setSearchFocused(false); // Close the search dropdown after hashtag selection
    }
  };

  const handleHashtagClick = (tag: string) => {
    const hashtagQuery = tag.startsWith('#') ? tag : `#${tag}`;
    setSearchQuery(hashtagQuery);
    setSearchFocused(false); // Close the search dropdown
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchFocused(false);
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
        postType: post.tipo_post,
        author: post.nomeAutor,
        content: post.conteudo,
        timestamp: post.data_criacao,
      };
      onPostClick('post-details', postDetails);
    }
  };

  const handleUserClick = (username: string) => {
    if (onUserClick) {
      const userDetails: UserProfileState = {
        username: username,
      };
      onUserClick('user-profile', userDetails);
    }
  };

  const RenderPost = ({ post }: { post: PostType }) => {
    const baseProps = {
      id: post.id,
      author: post.nomeAutor,
      username: post.username,
      content: post.conteudo,
      timestamp: post.data_criacao,
      likes: post.likesCount || 0,
      isLiked: post.isLiked || false,
      commentCount: post.commentCount || 0,
      onCommentClick: () => handleCommentClick(post),
      onUserClick: handleUserClick,
    };

    switch (post.tipo_post) {
      case 'normal':
        return (
          <Post
            key={post.id}
            {...baseProps}
          />
        );
      case 'debate':
        return (
          <DebatePost
            key={post.id}
            {...baseProps}
            topic={post.topic}
            sides={post.sides}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <SearchBar
          searchQuery={searchQuery}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          searchBarRef={searchBarRef}
          handleSearch={handleSearch}
          handleHashtagClick={handleHashtagClick}
          clearSearch={clearSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        {searchQuery.trim().length > 0 && (
          <div className="px-5 py-2 bg-rixa-dark-shadow border-b border-rixa-blue/20">
            <span className="text-rixa-cream text-sm">
              {searchQuery.startsWith('#') 
                ? `Buscando hashtag: ${searchQuery}...`
                : searchQuery.startsWith('@')
                ? `Buscando posts de: ${searchQuery}...`
                : `Buscando: ${searchQuery}...`
              }
            </span>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-rixa-cream">Carregando posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <SearchBar
          searchQuery={searchQuery}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          searchBarRef={searchBarRef}
          handleSearch={handleSearch}
          handleHashtagClick={handleHashtagClick}
          clearSearch={clearSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-rixa-red">{error?.message || 'Erro ao carregar dados'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <SearchBar
        searchQuery={searchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        searchBarRef={searchBarRef}
        handleSearch={handleSearch}
        handleHashtagClick={handleHashtagClick}
        clearSearch={clearSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      {/* Search Status Indicator */}
      {searchQuery.trim().length > 0 && (
        <div className="px-5 py-2 bg-rixa-dark-shadow border-b border-rixa-blue/20">
          <div className="flex items-center justify-between">
            <span className="text-rixa-cream text-sm">
              {searchQuery.startsWith('#') 
                ? `Resultados para hashtag: ${searchQuery}`
                : searchQuery.startsWith('@')
                ? `Posts de usuário: ${searchQuery}`
                : `Buscando por: ${searchQuery}`
              }
            </span>
            <button
              onClick={clearSearch}
              className="text-rixa-blue hover:text-rixa-cream text-sm underline"
            >
              Limpar busca
            </button>
          </div>
        </div>
      )}
      
      <div
        className="flex-1 overflow-y-auto px-5 space-y-4 
                   scrollbar-thin scrollbar-track-rixa-dark 
                   scrollbar-thumb-rixa-blue hover:scrollbar-thumb-rixa-cream
                   scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
      >
        {!displayPosts || displayPosts.length === 0 ? (
          <div className="text-center py-12 text-rixa-cream/60">
            {loading ? (
              'Carregando...'
            ) : searchQuery ? (
              searchQuery.startsWith('#') 
                ? `Nenhum post encontrado para a hashtag ${searchQuery}`
                : searchQuery.startsWith('@')
                ? `Nenhum post encontrado para o usuário ${searchQuery}`
                : 'Nenhum post encontrado para sua busca.'
            ) : (
              'Nenhum post disponível.'
            )}
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