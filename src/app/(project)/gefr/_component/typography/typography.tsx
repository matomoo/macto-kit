export function TwH1({ text }: { text: string }) {
  return <h1 className="scroll-m-20 text-balance text-center font-extrabold text-4xl tracking-tight">{text}</h1>;
}
export function TwH2({ text }: { text: string }) {
  return <h1 className="scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight first:mt-0">{text}</h1>;
}

export function TwH3({ text }: { text: string }) {
  return <h1 className="scroll-m-20 font-semibold text-2xl tracking-tight">{text}</h1>;
}

export function TwH4({ text }: { text: string }) {
  return <h1 className="scroll-m-20 font-semibold text-xl tracking-tight">{text}</h1>;
}

export function TwParagraph({ text }: { text: string }) {
  return <h1 className="not-first:mt-6 leading-7">{text}</h1>;
}

export function TwLead({ text }: { text: string }) {
  return <h1 className="text-muted-foreground text-xl">{text}</h1>;
}

export function TwLarge({ text }: { text: string }) {
  return <h1 className="font-semibold text-lg">{text}</h1>;
}

export function TwSmall({ text }: { text: string }) {
  return <h1 className="font-medium text-sm leading-none">{text}</h1>;
}

export function TwMuted({ text }: { text: string }) {
  return <h1 className="text-muted-foreground text-sm">{text}</h1>;
}
