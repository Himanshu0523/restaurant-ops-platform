
import AuthLayout from "@/features/auth/components/AuthLayout";

export const metadata = {
    title: "Account | Restaurant App",
    description: "Account | Restaurant App",
}

export default function AuthGroupLayout({children}) {
    return (
        <AuthLayout>{children}</AuthLayout>
    )
}