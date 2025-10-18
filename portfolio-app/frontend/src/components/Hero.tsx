import { Link } from "@components/Link"

export const HeroSection: React.FC = () => {
  return (
    <>
      <main className="max-w-screen-md bg-zinc-50 px-2 pb-12 pt-2 font-serif text-lg text-zinc-900 md:mx-auto">
        <section className="my-6 flex flex-col items-center justify-around gap-6 text-center sm:flex-row sm:gap-4 sm:text-left">
          <div className="order-last font-sans sm:order-first">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">Maverick Espinosa</h1>
            <p className="text-lg">Software Engineer, Music Producer</p>
          </div>

          <div className="flex justify-center">
            {/*Avoiding the Image component as it makes my image too blurry.*/}
            <img
              src="/assets/headshot_500x500.webp"
              alt="My headshot!"
              width="256"
              height="256"
              className="rounded-lg"
            />
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <p>
            Hi, I'm Maverick. I'm currently working on autonomous vessel data ingestion and parsing
            at the Johns Hopkins Applied Physics Lab, and have previously worked at The Center for
            Psychadelic & Consciousness Research at Johns Hopkins University. In the past, I led an
            engineering team at <Link href="https://www.q2l.app/">Quest2Learn</Link> and consulted
            at multiple local startups.
          </p>
          <p>
            I completed my MS in Computer Science at Arizona State University, where I primarily
            studied cybersecurity: binary analysis and exploitation, reverse engineering, and
            network security.
          </p>
          <p>
            I'm also a classNameically-trained clarinetist, and I completed my BMus in Clarinet
            Performance at Arizona State University. I've studied with
            <Link href="https://www.selmer.fr/en/blogs/artistes/robert-spring">
              Dr. Robert Spring
            </Link>
            ,
            <Link href="https://www.selmer.fr/en/blogs/artistes/joshua-gardner">
              Dr. Joshua Gardner
            </Link>
            , and
            <Link href="https://www.selmer.fr/en/blogs/artistes/stefanie-gardner">
              Dr. Stefanie Gardner
            </Link>
            . In addition to the clarinet, I play the bass clarinet, contra-alto clarinet, and
            contrabass clarinet.
          </p>
          <p>
            Oh, and I repair musical instruments! I studied instrument repair with Dr. Steve
            Prescott, a well-known repairperson in the clarinet community. I primarily focus on
            clarinet repair, though I've done a bit of work on flutes and saxophones.
          </p>
          <p>
            Some of my other interests include calisthenics, cooking, language learning, note-taking
            systems, ergonomic keyboards, type theory, (Neo)vim, Emacs, Linux, and NixOS.
          </p>
          <p>
            You can find me on
            <Link href="https://github.com/emaverick2001/">GitHub</Link>,
            <Link href="https://x.com/MaverickEspDev">Twitter</Link>, and
            <Link href="https://www.linkedin.com/in/d-biswas/">LinkedIn</Link>.
          </p>
        </section>
      </main>
    </>
  )
}
