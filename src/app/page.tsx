import React from 'react'
import { GET_TOP } from '@/graphql/queries'
import { getClient } from '@/lib/apolloClient'
import styles from './page.module.scss'
import { MorePosts } from '@/components/parts/MorePosts'
import { Post } from '@/components/parts/Post'
import Link from 'next/link'
import { Profile } from '@/components/parts/Profile'
import { Metadata } from 'next'

type Post = {
  databaseId: number
  modified: string
  title: string
  tags: string[]
  categories: string[]
  terms: string[]
}

export const metadata: Metadata = {
  title: 'zawatech.com',
  description:
    'webフロントエンド領域を中心に、日々の技術で詰まった事の解決方法などをまとめているエンジニアブログです',
  openGraph: {
    url: `https://zawatech.com/`,
    images: `/api/og?title=zawatech.com`,
    title: 'zawatech.com',
    siteName: 'zawatech.com',
    description:
      'webフロントエンド領域を中心に、日々の技術で詰まった事の解決方法などをまとめているエンジニアブログです',
  },
}

export default async function Home() {
  const baseUrl = 'http://localhost:3000'
  const { data } = await getClient().query({
    query: GET_TOP,
    variables: { size: 5, offset: 0 },
  })

  const posts: Post[] = new Array()
  const hasMore = data?.posts.pageInfo.offsetPagination.hasMore

  data?.posts.nodes.map((post: any) => {
    const tags = new Array()
    const categories = new Array()
    const terms = new Array()

    post?.tags?.nodes.map((tag: any) => {
      tags.push(tag.name)
    })
    post?.categories?.nodes.map((category: any) => {
      categories.push(category.name)
    })
    post?.terms?.nodes.map((term: any) => {
      terms.push(term.name)
    })

    posts.push({
      databaseId: post.databaseId,
      modified: post.modified,
      title: post.title,
      tags,
      categories,
      terms,
    })
  })

  return (
    <main>
      <div className={styles['main-wrapper']}>
        <div className={styles['left-contents']}></div>

        <div className={styles['center-contents']}>
          {posts.map((post: Post) => (
            <Link
              href={`/post?p=${post.databaseId}`}
              key={post.databaseId}
              className={styles['post-link']}
            >
              <Post
                title={post.title}
                date={post.modified}
                tags={post.tags}
                categories={post.categories}
                terms={post.terms}
              />
            </Link>
          ))}
          {hasMore && <MorePosts />}
        </div>
        <div className={styles['right-contents']}>
          <Profile />
        </div>
      </div>
    </main>
  )
}
