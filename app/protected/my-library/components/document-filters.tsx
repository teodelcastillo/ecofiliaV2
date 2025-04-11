"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, X, Check, SlidersHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DocumentFiltersProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  onClearFilters?: () => void
  className?: string
}

export function DocumentFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  onClearFilters,
  className = "",
}: DocumentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClearFilters = () => {
    onSelectCategory(null)
    if (onClearFilters) {
      onClearFilters()
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {selectedCategory && (
              <Badge variant="secondary" className="ml-1 px-1 py-0">
                1
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Filter by Category</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => {
                handleClearFilters()
                setIsOpen(false)
              }}
              disabled={!selectedCategory}
            >
              Clear
            </Button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedCategory || ""}
            onValueChange={(value) => {
              onSelectCategory(value || null)
              setIsOpen(false)
            }}
          >
            <DropdownMenuRadioItem value="" className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>All Categories</span>
              </div>
              {!selectedCategory && <Check className="h-4 w-4" />}
            </DropdownMenuRadioItem>

            {categories.map((category) => (
              <DropdownMenuRadioItem
                key={category}
                value={category}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{category}</span>
                {selectedCategory === category && <Check className="h-4 w-4" />}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Badge variant="secondary" className="flex items-center gap-1 pl-2">
              <span>{selectedCategory}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={handleClearFilters}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear filter</span>
              </Button>
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
