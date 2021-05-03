import React, { createRef, useEffect } from "react"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import MainTools from "../components/MainTools"
import CommentSection from "../components/CommentSection"

const IndexPage = () => {
  const title = "Home"
  const commentSectionRef = createRef()

  useEffect(() => {
    const commentScript = document.createElement("script")
    // TODO: When the user changes theme, this should be updated too
    // const theme = typeof window !== "undefined" && isCurrentThemeDark() ? "github-dark" : "github-light"
    const theme = "github-light"
    commentScript.async = true
    commentScript.src = "https://utteranc.es/client.js"
    // TODO: Use ENV variables for it
    commentScript.setAttribute("repo", "raveofphonetics/comments")
    commentScript.setAttribute("issue-term", "pathname")
    commentScript.setAttribute("id", "utterances")
    commentScript.setAttribute("theme", theme)
    commentScript.setAttribute("crossorigin", "anonymous")
    if (commentSectionRef && commentSectionRef.current) {
      commentSectionRef.current.appendChild(commentScript)
    } else {
      console.log(`Error adding utterances comments on: ${commentSectionRef}`)
    }
  }, [])

  return (
    <Layout>
      <SEO title={title} />
      <MainTools />
      <CommentSection reactRef={commentSectionRef} />
    </Layout>
  )
}

export default IndexPage
