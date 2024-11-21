// components/polls/PollsList.js
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PollCard from './PollCard'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function PollsList({
  polls,
  isInstructor,
  hasVoted,
  handleVoteSubmit,
  selectedChoice,
  setSelectedChoice,
  showResults,
}) {
  return (
    <AnimatePresence mode="wait">
      {polls.length > 0 ? (
        polls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            isInstructor={isInstructor}
            hasVoted={hasVoted}
            handleVoteSubmit={handleVoteSubmit}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
            showResults={showResults}
          />
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-none shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />
              <p className="text-lg text-gray-600 text-center">
                No polls available for this instructor.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}