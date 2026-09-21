export function AuthCard({ title , subtitle , children , footer}) {
    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold">{title}</h1>
                {subtitle && <p className="text-zinc-500">{subtitle}</p>}
            </header>
            {children}
            {footer && (
                <div className="mt-6">
                    {footer}
                </div>
            )}
        </div>
    )
}