"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import useSWRMutation from 'swr/mutation'
import { DefaultSession } from "next-auth"

const formSchema = z.object({
  comments: z.string().min(2).max(1000),
  rating: z.coerce.number().min(0).lte(5),
  steps: z.coerce.number().min(0),
})

interface Props {
  placeId: string
  user: DefaultSession['user']
}

interface CreateReviewArg extends Props {
  comments: string,
  rating: number,
  steps: number,
}

export function AddReviewForm({ placeId, user }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comments: "",
      rating: 0,
      steps: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const review = await fetch("/api/reviews", {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          user,
          placeId
        })
      }).then(res => res.json())
      console.log(review)
    } catch (e) {
      // error handling
      console.error(e)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's the toilet like?"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Try not to write about things irrelevant to the place's accessibility.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input placeholder="How would you rate this place out of 5?" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="steps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Steps on entry</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex gap-2">
          <Send className="w-3 h-3" />
          Submit
        </Button>
      </form>
    </Form>
  )
}
