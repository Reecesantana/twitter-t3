import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingSpinner } from "y/components/loadingSpinner";

import { api, RouterOutputs } from "y/utils/api";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  console.log(user?.id);

  if (!user) return null;

  return (
    <div className="flex gap-3 py-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-16 w-16 rounded-full p-2"
        width={64}
        height={64}
      />
      <input
        type="text"
        placeholder="Post Something!"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b">
      <Image
        src={author?.profilePicture}
        alt={`${author.username} Profile Image`}
        className="h-16 w-16 rounded-full p-2"
        width={64}
        height={64}
      />
      <div className="flex flex-col">
        <div className="text-slate-300">
          <span className="font-semibold">{`>${author.username}`}</span>{" "}
          <span className="font-light">{`. ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className="align-middle">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  if(postLoading) return <LoadingSpinner/>

  if(!data) return <div>Something Went Wrong!!!</div>

  return (
    <div className="flex flex-col">
    {data?.map((fullPost) => (
      <PostView {...fullPost} key={fullPost.post.id} />
    ))}
  </div>
  )
}

const Home: NextPage = () => {
  //to fetch instantly
  api.posts.getAll.useQuery();

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  //Return empty div if user has not loaded yet
  if(!userLoaded) return <div />

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-200 md:max-w-2xl">
          <div className="border-b">
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <CreatePostWizard />}
          </div>
         <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
