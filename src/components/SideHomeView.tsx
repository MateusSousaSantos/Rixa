import React, { useState, useEffect } from "react";
import { Post } from "./posts/NormalPost";
import type { PostType } from "../components/posts/index";
import type { NavigationView, PostDetailsState } from "../types/navigation";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { FaPoll } from "react-icons/fa";
import { RiImage2Fill } from "react-icons/ri";
import { IoSend, IoLink } from "react-icons/io5";
import { useAuth } from "../hooks";
import { createPost, fetchPosts } from "../services/postService";

interface SideHomeViewProps {
  onPostClick?: (view: NavigationView, postDetails?: PostDetailsState) => void;
}

export const SideHomeView: React.FC<SideHomeViewProps> = ({ onPostClick }) => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  // Load posts on component mount
  useEffect(() => {
    loadSidePosts();
  }, []);

  const loadSidePosts = async () => {
    setLoading(true);
    try {
      const response = await fetchPosts(1, 5, 'newest'); // Load fewer posts for sidebar
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar posts da sidebar:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const PostBox = () => {
    const [postText, setPostText] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const handleCreatePost = async () => {
      if (!postText.trim() || isPosting) return;

      setIsPosting(true);
      try {
        const response = await createPost({
          author: "Você", // In real app, this would come from auth context
          content: postText,
          type: "normal"
        });

        if (response.success) {
          setPosts([response.data, ...posts]);
          setPostText("");
        }
      } catch (error) {
        console.error('Erro ao criar post:', error);
      } finally {
        setIsPosting(false);
      }
    };

    return (
      <div className="w-full bg-rixa-dark shadow-sm border-b border-rixa-blue/20 p-2 min-h-[8rem] flex flex-col justify-between">
        <div className="h-full w-full flex justify-normal items-center">
          <div className="w-full bg-rixa-dark-shadow rounded-lg flex items-center space-x-2 px-4 py-1">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full p-1 text-rixa-blue font-bold bg-transparent border-2 border-none rounded-lg focus:outline-none focus:border-rixa-cream/50 text-lg resize-none min-h-[2rem] max-h-40 overflow-y-auto flex items-center"
              placeholder="Digite sua rixa"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-rixa-blue/20">
          <div className="flex gap-6">
            <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
              <FaPoll size={25} />
            </button>
            <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
              <RiImage2Fill size={25} />
            </button>
            <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
              <IoLink size={25} />
            </button>
            <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
              <HiOutlineEmojiHappy size={25} />
            </button>
          </div>
          <button
            className={`text-rixa-cream/40 hover:text-rixa-cream/60 transition-colors ${
              isPosting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleCreatePost}
            disabled={isPosting || !postText.trim()}
          >
            <IoSend size={25} />
          </button>
        </div>
      </div>
    );
  };

  const RenderPost = ({ post }: { post: PostType }) => {
    switch (post.type) {
      case "normal":
        return (
          <Post
            key={post.id}
            author={post.author}
            content={post.content}
            timestamp={post.timestamp}
            onCommentClick={() => handleCommentClick(post)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 space-y-4 scrollbar-thin scrollbar-track-rixa-dark scrollbar-thumb-rixa-blue hover:scrollbar-thumb-rixa-cream scrollbar-thumb-rounded-full scrollbar-track-rounded-full pt-5">
        {loading ? (
          <div className="text-center py-4 text-rixa-cream/60">
            Carregando posts...
          </div>
        ) : (
          posts.map((post) => (
            <RenderPost key={post.id} post={post} />
          ))
        )}
      </div>
      {isAuthenticated && <PostBox />}
    </div>
  );
};