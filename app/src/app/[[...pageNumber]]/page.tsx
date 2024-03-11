import drizzle, { quotesTable } from "../lib/drizzle";
import Image from "next/image";
import { sql } from "drizzle-orm";

const quotesPerPage = 5;

async function getQuotes(pageNumber: number) {
  return drizzle
    .select()
    .from(quotesTable)
    .limit(quotesPerPage)
    .offset(pageNumber * quotesPerPage);
}

async function getQuoteCount() {
  return drizzle
    .select({ count: sql<number>`count(*)` })
    .from(quotesTable)
    .then((result) => result[0].count);
}

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { pageNumber: string };
}) {
  const pageNumber = parseInt(params.pageNumber ?? "0");
  console.log(pageNumber)
  const quotes = await getQuotes(pageNumber);
  const quoteCount = await getQuoteCount();

  return (
    <div className="flex justify-center items-center flex-col p-8 gap-8">
      <h1 className="text-2xl text-gray-600">
        Assignment completed by{" "}
        <a href="https://justin.poehnelt.com">Justin Poehnelt</a> with source
        available at <a href="https://github.com/jpoehnelt/cohere">GitHub</a>.
      </h1>
      <Image
        src="/cohere.svg"
        alt="Cohere Logo"
        className="w-[50vh]"
        width={100}
        height={24}
        priority
      />
      <ul className="flex flex-col gap-4">
        {quotes.map((quote) => (
          <li
            key={quote.id}
            className="border-l-4 border-purple-300 bg-gray-50 p-3 flex flex-col gap-2"
          >
            <blockquote className="italic">{quote.quote_text}</blockquote>
            <p className="text-right">- {quote.author}</p>
          </li>
        ))}
      </ul>

      <div className="flex gap-4">
        {pageNumber >= 1 ? (
          <a href={`/${pageNumber - 1}`} className="btn">
            Previous
          </a>
        ) : null}
        {Math.ceil(quoteCount / quotesPerPage) > pageNumber + 1 ? (
          <a href={`/${pageNumber + 1}`} className="btn">
            Next
          </a>
        ) : null}
      </div>
    </div>
  );
}
