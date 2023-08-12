import React, { createRef } from "react"
import { RECAPTCHA_SITE_KEY, UTTERANCES_REPOSITORY } from "../config/settings"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
import MainTools from "../components/MainTools"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import CommentSection from "../components/CommentSection"

const IndexPage = () => {
  const title = "Home"
  const commentSectionRef = createRef()

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <Layout>
        <SEO title={title} />
        <MainTools />
        {UTTERANCES_REPOSITORY && <CommentSection reactRef={commentSectionRef} />}
      </Layout>
    </GoogleReCaptchaProvider>
  )
}

export default IndexPage
