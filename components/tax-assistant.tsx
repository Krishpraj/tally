"use client"

import type React from "react"

import { useState, useRef, useEffect, Suspense } from "react"
import { useChat } from "@ai-sdk/react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Send,
  FileUp,
  Loader2,
  FileText,
  X,
  ChevronDown,
  BarChart3,
  Calculator,
  Calendar,
  DollarSign,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

// Lazy load the chart and table components for better performance
import dynamic from "next/dynamic"

const TaxBreakdownChart = dynamic(() => import("@/components/tax-breakdown-chart"), {
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center bg-muted/50 rounded-md">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
  ssr: false,
})

const TaxBreakdownTable = dynamic(() => import("@/components/tax-breakdown-table"), {
  loading: () => (
    <div className="h-[200px] w-full flex items-center justify-center bg-muted/50 rounded-md">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
})

const suggestedQuestions = [
  {
    text: "How do tax brackets work?",
    icon: <BarChart3 className="h-4 w-4 mr-2" />,
  },
  {
    text: "What's the standard deduction for 2023?",
    icon: <Calculator className="h-4 w-4 mr-2" />,
  },
  {
    text: "When is the tax filing deadline?",
    icon: <Calendar className="h-4 w-4 mr-2" />,
  },
  {
    text: "Can I deduct my home office expenses?",
    icon: <DollarSign className="h-4 w-4 mr-2" />,
  },
  {
    text: "What forms do I need for self-employment income?",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    text: "How do I report investment income?",
    icon: <DollarSign className="h-4 w-4 mr-2" />,
  },
  {
    text: "What's the difference between itemized and standard deductions?",
    icon: <HelpCircle className="h-4 w-4 mr-2" />,
  },
  {
    text: "How do I check my refund status?",
    icon: <Clock className="h-4 w-4 mr-2" />,
  },
]

// Wrap dynamic content in Suspense for Partial Prerendering
function DynamicContent({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export default function TaxAssistant() {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const isMobile = useMobile()
  const { toast } = useToast()

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, error } = useChat({
    api: "/api/chat",
    onFinish: () => {
      // Invalidate and refetch any queries as needed
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] })

      // Set typing to false when finished
      setIsTyping(false)
    },
    onError: (err) => {
      console.error("Chat error:", err)
      toast({
        title: "Error",
        description: "There was an error connecting to the AI. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Set typing indicator when a new message is being generated
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true)
    }
  }, [isLoading])

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fileToUpload) return

    setIsUploading(true)

    // Simulate file upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Add file to uploaded files list
    setUploadedFiles((prev) => [...prev, fileToUpload.name])

    // Show success toast
    toast({
      title: "File uploaded successfully",
      description: `${fileToUpload.name} has been uploaded and is being analyzed.`,
      duration: 3000,
    })

    // Simulate AI response to file upload
    const fileType = fileToUpload.name.split(".").pop()?.toLowerCase()
    const fileMessage = `I've uploaded a ${fileType} file: ${fileToUpload.name}`

    try {
      await append({
        role: "user",
        content: fileMessage,
      })

      let aiResponse = ""

      if (fileToUpload.name.toLowerCase().includes("w-2")) {
        aiResponse =
          "I've analyzed your W-2 form. I can see your wages, federal income tax withheld, and other tax information. Would you like me to help you understand what these numbers mean for your tax return? I can also help calculate your potential refund based on this information."
      } else if (fileToUpload.name.toLowerCase().includes("1099")) {
        aiResponse =
          "I've analyzed your 1099 form. This shows income you've received as an independent contractor or from other sources. Would you like me to explain how this affects your tax obligations and what deductions might be available to you?"
      } else {
        aiResponse = `I've received your ${fileToUpload.name} file. How can I help you with this document? Would you like me to explain how this information affects your taxes?`
      }

      setIsTyping(true)

      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await append({
        role: "assistant",
        content: aiResponse,
      })
    } catch (err) {
      console.error("Error handling file upload:", err)
      toast({
        title: "Error",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTyping(false)
      setFileToUpload(null)
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0])
    }
  }

  const handleSuggestedQuestion = async (question: string) => {
    try {
      // Set typing indicator before sending the message
      setIsTyping(true)

      await append({
        role: "user",
        content: question,
      })
    } catch (err) {
      console.error("Error handling suggested question:", err)
      toast({
        title: "Error",
        description: "There was an error processing your question. Please try again.",
        variant: "destructive",
      })
      setIsTyping(false)
    }
  }

  const handleScroll = () => {
    if (!messagesContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

    setShowScrollButton(!isNearBottom)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[75vh] md:h-[80vh]">
      <Card className="flex-1 overflow-hidden flex flex-col border-slate-200 dark:border-slate-800 shadow-lg rounded-xl">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent"
        >
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
              <p>Error: {error.message || "There was an error connecting to the AI. Please try again."}</p>
            </div>
          )}
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col items-center justify-center text-center p-8"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Welcome to the Tax Assistant</h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Ask me any questions about your taxes, or upload your tax documents for analysis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedQuestions.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      className="justify-start text-left h-auto py-3 w-full group hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => handleSuggestedQuestion(question.text)}
                      disabled={isLoading || isTyping}
                    >
                      <span className="flex items-center">
                        {question.icon}
                        <span className="group-hover:text-primary transition-colors">{question.text}</span>
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="space-y-6">
                {messages.map((message, index) => {
                  const isUser = message.role === "user"
                  const timestamp = new Date()

                  // Check for special content that should render as a chart or table
                  const hasChart = message.content.includes("[TAX_BRACKET_CHART]")
                  const hasTable = message.content.includes("[TAX_BREAKDOWN_TABLE]")

                  // Process content to remove special markers
                  const content = message.content
                    .replace("[TAX_BRACKET_CHART]", "")
                    .replace("[TAX_BREAKDOWN_TABLE]", "")

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn("flex", isUser ? "justify-end" : "justify-start")}
                    >
                      {!isUser && (
                        <div className="flex-shrink-0 mr-3">
                          <Avatar className="h-9 w-9 border-2 border-primary/20">
                            <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-xs font-bold">
                              TA
                            </div>
                          </Avatar>
                        </div>
                      )}
                      <div className={cn("flex flex-col max-w-[85%] md:max-w-[75%]", isUser && "items-end")}>
                        <div className="flex items-center mb-1">
                          <span className="text-xs text-muted-foreground">
                            {isUser ? "You" : "Tax Assistant"} • {formatTime(timestamp)}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "rounded-xl p-4",
                            isUser
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-muted dark:bg-slate-800 rounded-tl-none",
                          )}
                        >
                          <div className="whitespace-pre-wrap text-sm md:text-base">{content}</div>

                          {hasChart && (
                            <div className="mt-4">
                              <Tabs defaultValue="chart" className="w-full">
                                <TabsList className="mb-2 w-full">
                                  <TabsTrigger value="chart" className="flex-1">
                                    Chart View
                                  </TabsTrigger>
                                  <TabsTrigger value="table" className="flex-1">
                                    Table View
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent value="chart">
                                  <DynamicContent>
                                    <TaxBreakdownChart />
                                  </DynamicContent>
                                </TabsContent>
                                <TabsContent value="table">
                                  <DynamicContent>
                                    <TaxBreakdownTable />
                                  </DynamicContent>
                                </TabsContent>
                              </Tabs>
                            </div>
                          )}

                          {hasTable && !hasChart && (
                            <div className="mt-4">
                              <DynamicContent>
                                <TaxBreakdownTable />
                              </DynamicContent>
                            </div>
                          )}

                          {!isUser && index === messages.length - 1 && !isLoading && !isTyping && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {suggestedQuestions.slice(0, 3).map((question, qIndex) => (
                                <Button
                                  key={qIndex}
                                  variant="secondary"
                                  size="sm"
                                  className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  onClick={() => handleSuggestedQuestion(question.text)}
                                  disabled={isLoading || isTyping}
                                >
                                  {question.icon}
                                  <span className="ml-1">
                                    {question.text.length > 25 ? question.text.substring(0, 25) + "..." : question.text}
                                  </span>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {isUser && (
                        <div className="flex-shrink-0 ml-3">
                          <Avatar className="h-9 w-9 border-2 border-secondary/20">
                            <div className="bg-secondary text-secondary-foreground h-full w-full flex items-center justify-center text-xs font-bold">
                              YOU
                            </div>
                          </Avatar>
                        </div>
                      )}
                    </motion.div>
                  )
                })}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex-shrink-0 mr-3">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-xs font-bold">
                          TA
                        </div>
                      </Avatar>
                    </div>
                    <div className="flex flex-col max-w-[85%] md:max-w-[75%]">
                      <div className="flex items-center mb-1">
                        <span className="text-xs text-muted-foreground">Tax Assistant • {formatTime(new Date())}</span>
                      </div>
                      <div className="rounded-xl p-4 bg-muted dark:bg-slate-800 rounded-tl-none">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"></div>
                          <div
                            className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-24 right-6"
            >
              <Button size="icon" className="rounded-full shadow-md" onClick={scrollToBottom}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          {fileToUpload && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mb-3 p-3 bg-muted dark:bg-slate-800 rounded-lg"
            >
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm truncate flex-1">{fileToUpload.name}</span>
              <div className="flex gap-2">
                <form onSubmit={handleFileUpload}>
                  <Button type="submit" size="sm" disabled={isUploading || isLoading || isTyping} className="h-8">
                    {isUploading ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </form>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setFileToUpload(null)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about your taxes..."
                className="pr-10 py-6 bg-muted/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
                disabled={isLoading || isUploading || isTyping}
              />
              {uploadedFiles.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground"
                      >
                        <Badge
                          variant="outline"
                          className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                        >
                          {uploadedFiles.length}
                        </Badge>
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Uploaded files</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 bg-muted/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-800"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isUploading || isTyping}
                  >
                    <FileUp className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload tax document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-12 w-12"
                    disabled={isLoading || isUploading || isTyping || !input.trim()}
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>

          <div className="mt-2 text-xs text-center text-muted-foreground">
            Tax Assistant provides general guidance only. For personalized advice, consult a tax professional.
          </div>
        </div>
      </Card>
    </div>
  )
}

