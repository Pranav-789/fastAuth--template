import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI, blogAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface UserProfileData {
  id: number;
  name: string;
  email: string;
  _count?: {
    followers: number;
    following: number;
  }
}

interface FollowerItem {
  followerId: number;
  follower: {
    id: number;
    name: string;
  }
}

interface FollowingItem {
  followingId: number;
  following: {
    id: number;
    name: string;
  }
}

interface BlogPost {
  id: number;
  title: string;
  createdAt: string;
  authorName: string;
  _count: {
    likes: number;
  };
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<UserProfileData | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [followers, setFollowers] = useState<FollowerItem[]>([]);
  const [following, setFollowing] = useState<FollowingItem[]>([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  const isOwnProfile = currentUser?.id === Number(userId);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const idNum = Number(userId);
        
        // Fetch user basic data
        const userRes = await userAPI.getUserById(idNum);
        setProfileUser(userRes.data.data);
        
        // Fetch user's blogs
        const blogsRes = await blogAPI.getAuthorBlogs(idNum);
        setBlogs(blogsRes.data.data || []);
        
        if (!isOwnProfile && currentUser) {
            const followRes = await userAPI.checkIfFollowing(idNum);
            setIsFollowing(!!followRes.data.following);
        }

      } catch (err: any) {
        console.error("Failed to fetch profile", err);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, currentUser, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!profileUser) return;
    
    try {
      if (isFollowing) {
        await userAPI.unfollowUser(profileUser.id);
        setIsFollowing(false);
        setProfileUser(prev => prev ? {...prev, _count: prev._count ? {...prev._count, followers: Math.max(0, prev._count.followers - 1)} : undefined} : prev);
      } else {
        await userAPI.followUser(profileUser.id);
        setIsFollowing(true);
        setProfileUser(prev => prev ? {...prev, _count: prev._count ? {...prev._count, followers: prev._count.followers + 1} : undefined} : prev);
      }
    } catch (err) {
      console.error("Error toggling follow", err);
      alert("Failed to update follow status.");
    }
  };

  const handleOpenFollowers = async () => {
    if (!profileUser) return;
    setShowFollowersModal(true);
    setIsLoadingLists(true);
    try {
      const res = await userAPI.getFollowers(profileUser.id);
      setFollowers(res.data.followers || []);
    } catch (err) {
      console.error("Failed to fetch followers", err);
    } finally {
      setIsLoadingLists(false);
    }
  };

  const handleOpenFollowing = async () => {
    if (!profileUser) return;
    setShowFollowingModal(true);
    setIsLoadingLists(true);
    try {
      const res = await userAPI.getFollowing(profileUser.id);
      setFollowing(res.data.following || []);
    } catch (err) {
      console.error("Failed to fetch following", err);
    } finally {
      setIsLoadingLists(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8 mt-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-5xl font-bold flex-shrink-0">
          {profileUser.name ? profileUser.name.charAt(0).toUpperCase() : '?'}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {profileUser.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {profileUser.email}
            </p>
          </div>
          
          <div className="flex justify-center md:justify-start gap-6 pt-2">
             <div className="text-center group cursor-pointer" onClick={handleOpenFollowers}>
                <span className="block text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{profileUser._count?.followers || 0}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Followers</span>
             </div>
             <div className="text-center group cursor-pointer" onClick={handleOpenFollowing}>
                <span className="block text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{profileUser._count?.following || 0}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Following</span>
             </div>
             <div className="text-center">
                <span className="block text-xl font-bold text-gray-900 dark:text-white">{blogs.length}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Posts</span>
             </div>
          </div>
        </div>

        {!isOwnProfile && currentUser && (
          <div className="flex-shrink-0">
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isFollowing 
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}
      </div>

      {/* User's Blogs */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
          Posts by {profileUser.name}
        </h2>
        
        {blogs.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {isOwnProfile ? "You haven't posted any blogs yet." : "This user doesn't have any posts yet."}
            </p>
            {isOwnProfile && (
              <Link to="/blogs/create" className="text-blue-600 hover:underline mt-2 inline-block">
                Create a new post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Published on {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    <span>{blog._count?.likes || 0}</span>
                  </div>
                  
                  <Link
                    to={`/blogs/${blog.id}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Followers</h3>
              <button onClick={() => setShowFollowersModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {isLoadingLists ? (
                <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
              ) : followers.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No followers yet.</p>
              ) : (
                <div className="space-y-3">
                  {followers.map(f => (
                    <Link key={f.followerId} to={`/profile/${f.follower.id}`} onClick={() => setShowFollowersModal(false)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                        {f.follower.name ? f.follower.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{f.follower.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Following</h3>
              <button onClick={() => setShowFollowingModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {isLoadingLists ? (
                <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
              ) : following.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Not following anyone yet.</p>
              ) : (
                <div className="space-y-3">
                  {following.map(f => (
                    <Link key={f.followingId} to={`/profile/${f.following.id}`} onClick={() => setShowFollowingModal(false)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                        {f.following.name ? f.following.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{f.following.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
