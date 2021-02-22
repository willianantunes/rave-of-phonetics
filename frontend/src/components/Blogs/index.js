import React from "react"
import { Link } from "gatsby-theme-material-ui"
import * as S from "./styled"
import ReactGA from "react-ga"

const trackClick = title => {
  ReactGA.event({
    category: "Blog",
    action: "click",
    label: `Post - ${title}`,
  })
}

export default function Blogs({ posts }) {
  return (
    <>
      <S.Title>
        Learn more about linguistics aspects of phonetics and transcriptions{" "}
        <span role="img" aria-label="Books">
          📚
        </span>
      </S.Title>
      <S.BlogEntries>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const whenItWasPosted = post.frontmatter.date
          const description = post.frontmatter.description || post.excerpt

          return (
            <S.ArticleWrapper key={post.frontmatter.id}>
              <S.ArticleHeaderWrapper>
                <S.ArticleTitle>
                  <Link to={post.fields.path} itemProp="url" onClick={() => trackClick(title)}>
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
