"use client";

import { useCallback, useEffect, useState } from "react";
import CarouselContainer from "../components/templates/CarouselContainer";
import { fetchAPI } from "../utils/fetch-api";
import { YONO_ROUTES } from "../utils/constant";

interface Meta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}

interface Category {
  id: number;
  attributes: {
    name: string;
    title: string;
    games: any;
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    category: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    authorsBio: {
      data: {
        attributes: {
          name: string;
          avatar: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
  };
}

export default function Home() {
  const [meta, setMeta] = useState<Meta | undefined>();
  const [data, setData] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = useCallback(async (start: number, limit: number) => {
    setLoading(true);
    try {
      // const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const path = YONO_ROUTES.CATEGORIES;
      const urlParamsObject = {
        sort: { createdAt: "asc" },
        populate: "games.thumbnail",
        pagination: {
          start: start,
          limit: limit,
        },
      };
      // const options = { headers: { Authorization: `Bearer ${token}` } };
      const responseData = await fetchAPI(
        path,
        urlParamsObject
        /* options */
      );

      if (start === 0) {
        setData(responseData.data);
      } else {
        setData((prevData: any[]) => [...prevData, ...responseData.data]);
      }

      setMeta(responseData.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loader = document.getElementById("globalLoader");
      if (loader) loader.remove();
    }
  }, []);

  useEffect(() => {
    fetchData(0, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
  }, [fetchData]);

  return (
    <div>
      {data.map((category: Category, index: number) => {
        return (
          <CarouselContainer
            key={category.id}
            title={category.attributes.title}
            size={index === 0 ? "medium" : "small"}
            icon={"star"}
            games={category.attributes.games.data as any} // Update the type of the games prop
          />
        );
      })}
    </div>
  );
}
