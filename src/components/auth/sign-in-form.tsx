import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface SignInFormProps {
    onSubmit: (data: SignInSchema) => void;
    isSubmitting: boolean;
    error?: Error | null;
}

export function SignInForm({ onSubmit, isSubmitting, error }: SignInFormProps) {
    const form = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "" },
    });

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>
                    Use <code className="font-mono">admin@app.com</code> /{" "}
                    <code className="font-mono">password</code>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            autoComplete="email"
                                            {...field}
                                        />
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
                                        <Input
                                            type="password"
                                            autoComplete="current-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error?.message && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {error?.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
