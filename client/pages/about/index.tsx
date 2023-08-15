import { Divider, Typography } from "antd";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export const getStaticProps: GetStaticProps<{
    AboutMd: string;
}> = async () => {
    const res = await fetch(
        "https://raw.githubusercontent.com/b-l-i-n-d/edTech/master/README.md"
    );
    const AboutMd = await res.text();

    return {
        props: {
            AboutMd,
        },
    };
};

const About = ({ AboutMd }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <div>
            <Head>
                <title>About</title>
            </Head>
            <Typography.Title
                level={4}
                style={{
                    fontWeight: "bold",
                }}
            >
                About
            </Typography.Title>
            <Typography.Text type="secondary">
                Wnat to know more about us?
            </Typography.Text>

            <Divider />

            <Typography.Paragraph>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    className="markdown-image"
                >
                    {AboutMd}
                </ReactMarkdown>
            </Typography.Paragraph>
        </div>
    );
};

export default About;
