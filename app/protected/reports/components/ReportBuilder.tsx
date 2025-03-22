"use client"

import { useState } from "react"
import { DragDropContext, Draggable, Droppable, DroppableProvided } from "react-beautiful-dnd"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart2, Droplet, Zap } from "lucide-react"

const availableMetrics = [
  { id: "carbon", name: "Carbon Emissions", icon: BarChart2 },
  { id: "water", name: "Water Usage", icon: Droplet },
  { id: "energy", name: "Renewable Energy", icon: Zap },
]

export function ReportBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<typeof availableMetrics>([])

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    if (result.source.droppableId === "available" && result.destination.droppableId === "preview") {
      const metric = availableMetrics.find((m) => m.id === result.draggableId)
      if (metric && !selectedMetrics.find((m) => m.id === metric.id)) {
        setSelectedMetrics([...selectedMetrics, metric])
      }
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Available Metrics</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="available">
            {(provided : DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {availableMetrics.map((metric, index) => (
                  <Draggable key={metric.id} draggableId={metric.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="cursor-move"
                      >
                        <CardContent className="flex items-center gap-2 p-4">
                          <metric.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm">{metric.name}</span>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Report Preview</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="preview">
            {(provided) => (
              <Card
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[300px] flex items-center justify-center border-dashed"
              >
                {selectedMetrics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Drag metrics here to build your report</p>
                ) : (
                  <div className="w-full p-4 space-y-2">
                    {selectedMetrics.map((metric, index) => (
                      <Card key={metric.id}>
                        <CardContent className="flex items-center gap-2 p-4">
                          <metric.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm">{metric.name}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {provided.placeholder}
              </Card>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Export Options</h3>
        <div className="space-y-2">
          <Card className="cursor-pointer hover:bg-muted/50">
            <CardContent className="flex items-center gap-2 p-4">
              <span className="text-red-500">PDF</span>
              <span className="text-sm">Export as PDF</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50">
            <CardContent className="flex items-center gap-2 p-4">
              <span className="text-blue-500">DOCX</span>
              <span className="text-sm">Export as Word</span>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50">
            <CardContent className="flex items-center gap-2 p-4">
              <span className="text-orange-500">PPT</span>
              <span className="text-sm">Export as PowerPoint</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

