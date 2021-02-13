import React from "react"
import { Link } from "gatsby-theme-material-ui"
import * as S from "./styled"

export default function Blogs({ posts }) {
  return (
    <>
      <S.Title>Learn more about linguistics aspects of phonetics and transcriptions</S.Title>
      <S.BlogEntries>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const whenItWasPosted = post.frontmatter.date
          const description = post.frontmatter.description || post.excerpt

          return (
            <S.ArticleWrapper>
              <S.ArticleHeaderWrapper>
                <S.ArticleTitle>
                  <Link to={`/blog${post.fields.slug}`} itemProp="url">
                    {title}
                  </Link>
                </S.ArticleTitle>
                <small>{whenItWasPosted}</small>
              </S.ArticleHeaderWrapper>
              <S.ArticleSection>
                <S.ArticleDescription dangerouslySetInnerHTML={{ __html: description }} />
              </S.ArticleSection>
            </S.ArticleWrapper>
          )
        })}
      </S.BlogEntries>
    </>
  )
}
