import drizzle, {quotesTable} from "./lib/drizzle";
import Image from "next/image";


async function getQuotes() {
  return (await drizzle.select().from(quotesTable)).sort(() => Math.random() - 0.5);

}

export const revalidate = 0;

export default async function Page() {
  const quotes = await getQuotes();

  return (
    <div className="flex justify-center items-center flex-col p-8">
      <h1 className="text-2xl text-gray-600">
        Assignment completed by{" "}
        <a
          className="text-purple-500 font-bold"
          href="https://justin.poehnelt.com"
        >
          Justin Poehnelt
        </a>
        .
      </h1>
      <Image
        src="/cohere.svg"
        alt="Cohere Logo"
        className="w-[50vh]"
        width={100}
        height={24}
        priority
      />
      <ul className="mt-8 flex flex-col gap-4">
        {quotes.map((quote) => (
          <li key={quote.id} className="border-l-4 border-purple-300 bg-gray-50 p-3 flex flex-col gap-2">
            <blockquote className="italic">
              {quote.quote_text}
            </blockquote>
            <p className="text-right">
              - {quote.author}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
