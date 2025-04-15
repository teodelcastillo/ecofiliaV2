import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, MessageSquare, ThumbsUp, BookMarked, Sparkles, Users, BookOpen, UsersRound } from "lucide-react"
import { WaitlistModal } from "./components/waitlist-modal"

export default function CommunityPage() {
  return (
    <div className="container py-10">
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <UsersRound className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Community</h1>
      </div>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        <span className="block mb-4">
          Welcome to the <b>Ecofilia Community</b> — a space designed for connection, collaboration, and knowledge-sharing.
        </span>
        <span className="block mb-4">
          Here, members can spark discussions, ask questions, share ideas, and support each other’s work. You’ll be able to collaborate on projects, and showcase your own document libraries — whether you choose to make them public or offer exclusive access through subscriptions.
        </span>
        <span className="block">
          Let’s build a <b>smarter, and greener future together</b>.
        </span>
      </p>

    </div>
      

      {/* Stats Section 
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Users className="h-6 w-6" />, label: "Active Members", value: "2,500+" },
          { icon: <BookMarked className="h-6 w-6" />, label: "Shared Libraries", value: "850+" },
          { icon: <MessageSquare className="h-6 w-6" />, label: "Daily Discussions", value: "120+" },
          { icon: <Sparkles className="h-6 w-6" />, label: "New Ideas", value: "300+" },
        ].map((stat, index) => (
          <Card key={index} className="border-none bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">{stat.icon}</div>
              <h3 className="mb-1 text-3xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>*/}

      {/* Coming Soon Banner */}
      <Card className="border-dashed bg-muted/30 mb-12">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center sm:p-10">
          <div className="rounded-full bg-primary/10 p-3">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Coming Soon</h3>
            <p className="mt-2 text-muted-foreground">
              We're working hard to bring this community feature to life. Join the waitlist to be the first to know when
              it launches.
            </p>
          </div>
          <WaitlistModal>
            <Button size="lg" className="mt-2">
              Join Waitlist
            </Button>
          </WaitlistModal>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="discussions" className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Explore Content</h2>
          <TabsList>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="libraries">Libraries</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="discussions" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {discussionMockData.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="libraries" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {libraryMockData.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ideas" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideaMockData.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>


      {/* Features Section */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">What to Expect</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Share Your Libraries",
              description:
                "Create and share your personal document libraries with the community. Get feedback and collaborate with others.",
              icon: <BookMarked className="h-5 w-5" />,
            },
            {
              title: "Engage in Discussions",
              description:
                "Start meaningful conversations about documents, research papers, and more. Learn from diverse perspectives.",
              icon: <MessageSquare className="h-5 w-5" />,
            },
            {
              title: "Discover New Ideas",
              description:
                "Explore innovative ideas shared by community members. Get inspired and contribute your own thoughts.",
              icon: <Sparkles className="h-5 w-5" />,
            },
          ].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2 w-fit rounded-md bg-primary/10 p-2 text-primary">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock Data
const discussionMockData = [
  {
    title: "Best practices for organizing research papers",
    excerpt: "I've been struggling with keeping my research papers organized. What systems do you all use?",
    author: {
      name: "Alex Johnson",
      avatar: "/thoughtful-reader.png",
    },
    category: "Organization",
    comments: 24,
    likes: 47,
    date: "2 days ago",
  },
  {
    title: "How to effectively annotate academic papers",
    excerpt: "Looking for tips on annotation strategies that help with retention and understanding complex topics.",
    author: {
      name: "Maya Patel",
      avatar: "curly-haired-portrait.png",
    },
    category: "Study Tips",
    comments: 18,
    likes: 32,
    date: "4 days ago",
  },
  {
    title: "Collaborative research: Tools and methods",
    excerpt: "What tools are you using for collaborative research projects? Looking for recommendations.",
    author: {
      name: "Sam Wilson",
      avatar: "/thoughtful-bearded-man.png",
    },
    category: "Collaboration",
    comments: 15,
    likes: 28,
    date: "1 week ago",
  },
]

const libraryMockData = [
  {
    title: "Machine Learning Research Collection",
    excerpt: "A curated collection of 200+ papers on recent advances in machine learning and AI.",
    author: {
      name: "Dr. Emily Chen",
      avatar: "/confident-asian-leader.png",
    },
    category: "AI & ML",
    comments: 42,
    likes: 156,
    date: "3 days ago",
  },
  {
    title: "Climate Science Essential Readings",
    excerpt: "My personal library of must-read papers for anyone interested in climate science and sustainability.",
    author: {
      name: "Marcus Green",
      avatar: "/placeholder.svg?height=40&width=40&query=black man smiling",
    },
    category: "Environment",
    comments: 31,
    likes: 98,
    date: "5 days ago",
  },
  {
    title: "Behavioral Economics Fundamentals",
    excerpt: "A starter pack of 50 papers that cover the foundations of behavioral economics.",
    author: {
      name: "Sophia Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&query=latina woman professional",
    },
    category: "Economics",
    comments: 27,
    likes: 84,
    date: "1 week ago",
  },
]

const ideaMockData = [
  {
    title: "AI-powered research assistant concept",
    excerpt: "What if we could create an AI that helps researchers find connections between papers they might miss?",
    author: {
      name: "Raj Patel",
      avatar: "/placeholder.svg?height=40&width=40&query=indian man tech",
    },
    category: "Innovation",
    comments: 56,
    likes: 132,
    date: "2 days ago",
  },
  {
    title: "Crowdsourced literature review platform",
    excerpt: "A platform where researchers can contribute to massive literature reviews collaboratively.",
    author: {
      name: "Lisa Wang",
      avatar: "/placeholder.svg?height=40&width=40&query=asian woman glasses",
    },
    category: "Platform",
    comments: 38,
    likes: 97,
    date: "6 days ago",
  },
  {
    title: "Visual knowledge mapping tool",
    excerpt: "A tool that visually maps connections between research papers, authors, and concepts.",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40&query=korean man professional",
    },
    category: "Tools",
    comments: 41,
    likes: 118,
    date: "1 week ago",
  },
]

// Post Card Component
// Define the type for the post object
interface Post {
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  comments: number;
  likes: number;
  date: string;
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <Badge variant="outline" className="mb-2">
            {post.category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            {post.date}
          </div>
        </div>
        <Link href="#" className="group">
          <CardTitle className="line-clamp-2 group-hover:text-primary">{post.title}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 px-6 py-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MessageSquare className="mr-1 h-3 w-3" />
              {post.comments}
            </div>
            <div className="flex items-center">
              <ThumbsUp className="mr-1 h-3 w-3" />
              {post.likes}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
