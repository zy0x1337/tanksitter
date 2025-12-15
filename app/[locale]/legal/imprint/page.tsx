import { getTranslations } from 'next-intl/server'

export default async function ImprintPage() {
  const t = await getTranslations('Legal')

  return (
    <>
      <h1>Impressum / Imprint</h1>
      
      <p>Angaben gemäß § 5 TMG</p>

      <h3>Betreiber / Operator</h3>
      <p>
        Mika Roprecht<br />
        Lönsstr. 2<br />
        31515 Wunstorf<br />
        Germany / Deutschland
      </p>

      <h3>Kontakt / Contact</h3>
      <p>
        Email: zy0x1337@proton.me<br />
      </p>

      <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
      <p>
        Mika Roprecht<br />
        Lönsstr. 2, 31515 Wunstorf
      </p>

      <hr className="my-8" />

      <p className="text-sm text-slate-500">
        Plattform der EU-Kommission zur Online-Streitbeilegung: https://ec.europa.eu/consumers/odr<br />
        Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
      </p>
    </>
  )
}
