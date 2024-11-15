import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import type { MetaFunction } from "@remix-run/cloudflare";
import { createClient } from "microcms-js-sdk";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ContentCard } from "~/components/content-card";

export const meta: MetaFunction = () => {
  return [
    { title: "トップページ | ダイモンTips" },
    {
      name: "description",
      content:
        "毎日を全力で生きているダイモンが、大好きな植物のことや日々の学びをアウトプットしています。",
    },
    {
      property: "og:image",
      content: "", // TODO:
    },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const client = createClient({
    serviceDomain: context.cloudflare.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: context.cloudflare.env.MICROCMS_API_KEY,
  });

  const response = await client.getList<Blog>({
    endpoint: "blogs",
    queries: {
      orders: "-createdAt",
      limit: 100, // TODO: ページネーション実装したら直す
    },
  });
  return typedjson({ response });
};

export default function Index() {
  const { response } = useTypedLoaderData<typeof loader>();
  const { contents } = response;

  return (
    <div className="container mx-auto w-full max-w-[1120px] py-8 md:py-10">
      <div className="mb-10 space-y-10">
        <div className="mb-10 space-y-4">
          <h2 className="text-center md:text-xl font-semibold">最新記事</h2>
          <p className="text-center text-sm md:text-md">
            ダイモンおすすめの記事をご覧ください
          </p>
        </div>
      </div>
      {contents.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 justify-center">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-muted-foreground text-center">
            記事が見つかりません
          </p>
        </div>
      )}
    </div>
  );
}
