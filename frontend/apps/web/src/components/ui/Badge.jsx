const tones = {
  gray:   "bg-neutral-100 text-neutral-700",
  green:  "bg-green-100 text-green-700",
  red:    "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  orange: "bg-orange-100 text-orange-700",
  blue:   "bg-blue-100 text-blue-700",
};


export function Badge({ tone = "gray" , className = "" , children , ...props}) {
    return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}>
        {children}
    </span>
    )
}