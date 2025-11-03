import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { SideHomeView } from '../components/views/SideHomeView';
import { PostDetails } from '../components/Posts/PostDetails';
import type { NavigationView, UserProfileState } from '../types/navigation';

interface PostDetailsPageProps {
  onNavigationChange?: (view: NavigationView, userDetails?: UserProfileState) => void;
}

export const PostDetailsPage: React.FC<PostDetailsPageProps> = ({ onNavigationChange }) => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleCommentClick = (view: string, postDetails?: any) => {
    if (view === 'post-details' && postDetails?.postId) {
      navigate(`/post/${postDetails.postId}`);
    }
  };

  if (!postId) {
    return (
      <div className="min-h-screen bg-rixa-dark">
        <Header />
        <div className="flex">
          <main className="flex-1">
            <div className="max-w-5xl mx-auto border-x border-b border-rixa-blue/20 h-full flex justify-center">
              <div className="h-full w-full sm:w-2/3 p-5">
                <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20 text-center">
                  <p className="text-rixa-red">Post ID não fornecido</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rixa-dark">
      <Header />
      <div className="flex">
        <main className="flex-1">
          <div className="max-w-5xl mx-auto border-x border-b border-rixa-blue/20 h-full flex justify-center">
            <div className="h-full w-full sm:w-2/3">
              <PostDetails 
                postId={parseInt(postId)}
                onBack={handleBack}
                onCommentClick={handleCommentClick}
              />
            </div>
            <div className="h-full w-1/3 border border-rixa-blue/20 border-y-0 border-l-1 border-r-0 hidden sm:block">
              <SideHomeView onUserClick={onNavigationChange} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};