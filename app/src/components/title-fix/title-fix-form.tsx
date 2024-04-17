"use client";

import { useEffect, type FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateMovieTitles } from "~/server/title-fix/update-movie-titles";
import { or } from "drizzle-orm";

const formSchema = z.object({
  title: z.string(),
  originalTitle: z.string(),
});

export const TitleFixForm: FC<{
  id: number;
  title: string;
  originalTitle: string;
}> = ({ id, title, originalTitle }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title ?? "",
      originalTitle: originalTitle ?? "",
    },
  });

  useEffect(() => {
    form.setValue("title", title);
    form.setValue("originalTitle", originalTitle);
  }, [title, originalTitle, form]);

  console.log("rerendinger", form);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateMovieTitles(id, values.title, values.originalTitle);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-80 flex-col items-center space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input className="w-96" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="originalTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Title</FormLabel>
              <FormControl>
                <Input className="w-96" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};
