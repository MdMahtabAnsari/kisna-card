"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card,CardFooter,CardHeader,CardContent,CardTitle,CardDescription } from "@/components/ui/card"
import { IdentifierPasswordSchema,identifierPasswordSchema } from "@/lib/schema/auth"
import { signIn } from "next-auth/react"

export default function Page() {
  const form = useForm<IdentifierPasswordSchema>({
    resolver: zodResolver(identifierPasswordSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (data: IdentifierPasswordSchema) => {
    const result = await signIn("identifier-password", {
      redirect: false,
      ...data,
    })
    if (result?.error) {
      console.error("Sign in error:", result.error);
      // Handle sign-in error (e.g., show a notification)
    } else {
      // Redirect or perform any action after successful sign-in
      console.log("Sign in successful");
    }
}


  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to sign in</CardDescription>
      </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Identifier</FormLabel>
                    <FormControl>
                        <Input placeholder="Email/UserId/Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">Sign In</Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}