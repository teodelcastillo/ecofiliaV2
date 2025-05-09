"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronDown, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  PublicDocumentCategory,
  CATEGORY_LABELS,
} from "../../../../types/categories"

interface DocumentFiltersProps {
  categories: (PublicDocumentCategory | null | undefined)[]
  selectedCategory: PublicDocumentCategory | null
  onSelectCategory: (category: PublicDocumentCategory | null) => void
}

export function DocumentFilters({
  categories,
  selectedCategory,
  onSelectCategory,
}: DocumentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const validCategories = categories.filter(
    (category): category is PublicDocumentCategory =>
      typeof category === "string" && category.trim() !== ""
  )

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Categories</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                onSelectCategory(null)
                setIsOpen(false)
              }}
            >
              <span>All Categories</span>
              {selectedCategory === null && <Check className="h-4 w-4" />}
            </DropdownMenuItem>

            {validCategories.map((category) => (
              <DropdownMenuItem
                key={category}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => {
                  onSelectCategory(category)
                  setIsOpen(false)
                }}
              >
                <span>{CATEGORY_LABELS[category]}</span>
                {selectedCategory === category && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCategory && (
        <Badge variant="secondary" className="gap-1">
          {CATEGORY_LABELS[selectedCategory]}
          <button onClick={() => onSelectCategory(null)} className="ml-1 hover:text-foreground rounded-full">
            ×
          </button>
        </Badge>
      )}
    </div>
  )
}
