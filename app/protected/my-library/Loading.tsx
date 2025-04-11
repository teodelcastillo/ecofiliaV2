import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, FolderKanban } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-48" />
      </div>
      <Skeleton className="h-5 w-full max-w-md mb-8" />

      <div className="space-y-6">
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>My Documents</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              <span>My Projects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-0">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
