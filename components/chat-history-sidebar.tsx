"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Plus, Trash2, History, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Define the ChatHistory type for our saved chats
export interface ChatHistory {
  id: string
  title: string
  timestamp: string
  preview: string
  messages: any[] // This will store the chat messages
}

interface ChatHistorySidebarProps {
  onSelect: (chatHistory: ChatHistory) => void
  onNew: () => void
  onDelete: (id: string) => void
  currentChatId: string | null
  isMobile: boolean
  isCollapsed?: boolean
  onCollapseToggle?: () => void
}

export function ChatHistorySidebar({
  onSelect,
  onNew,
  onDelete,
  currentChatId,
  isMobile,
  isCollapsed = false,
  onCollapseToggle,
}: ChatHistorySidebarProps) {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [isOpen, setIsOpen] = useState(!isMobile)
  const [internalCollapsed, setInternalCollapsed] = useState(isCollapsed)
  const { toast } = useToast()

  // Handle external and internal collapse state
  useEffect(() => {
    setInternalCollapsed(isCollapsed);
  }, [isCollapsed]);
  
  const toggleCollapse = () => {
    const newState = !internalCollapsed;
    setInternalCollapsed(newState);
    if (onCollapseToggle) {
      onCollapseToggle();
    }
  };

  // Load chat histories from localStorage on component mount
  useEffect(() => {
    const loadChatHistories = () => {
      const savedHistories = localStorage.getItem("chatHistories")
      if (savedHistories) {
        try {
          setChatHistories(JSON.parse(savedHistories))
        } catch (error) {
          console.error("Error parsing chat histories:", error)
          toast({
            title: "Error",
            description: "Could not load chat histories. Starting fresh.",
            variant: "destructive",
          })
        }
      }
    }

    loadChatHistories()
  }, [toast])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Handle deleting a chat history
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    
    const updatedHistories = chatHistories.filter((history) => history.id !== id)
    setChatHistories(updatedHistories)
    localStorage.setItem("chatHistories", JSON.stringify(updatedHistories))
    
    onDelete(id)

    toast({
      title: "Chat deleted",
      description: "The chat history has been removed.",
    })
  }

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <History className="h-5 w-5" />
        </Button>
      )}

      {/* Collapsed mode icon for desktop */}
      {!isMobile && internalCollapsed && (
        <div className="fixed top-4 left-4 z-40 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={toggleCollapse}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={onNew}
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg"
            title="Chat History"
          >
            <History className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && !internalCollapsed && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800",
              isMobile ? "shadow-xl" : ""
            )}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Chat History
                </h2>
                {isMobile ? (
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={toggleCollapse} title="Collapse Sidebar">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              <Button
                className="mx-4 mt-4"
                variant="default"
                onClick={onNew}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
              
              <ScrollArea className="flex-1 p-4">
                {chatHistories.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">
                    No chat histories yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chatHistories.map((history) => (
                      <Card
                        key={history.id}
                        className={cn(
                          "p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors group",
                          currentChatId === history.id && "bg-gray-100 dark:bg-slate-800"
                        )}
                        onClick={() => onSelect(history)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm line-clamp-1">{history.title}</h3>
                            <p className="text-xs text-muted-foreground">{formatDate(history.timestamp)}</p>
                            <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                              {history.preview}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-900"
                            onClick={(e) => handleDelete(e, history.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}