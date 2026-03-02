import { useState, useMemo } from "react";

const entries = [
  {
    num: 0,
    meanings: [
      { sys: "Tarot (Thoth)", text: "The Fool. Air, Hebrew letter Aleph. Pure potential before manifestation, the leap into the void, holy folly, the spirit descending into matter. Placed before the sequence — unnumbered or zero." },
    ],
  },
  {
    num: 14,
    meanings: [
      { sys: "Tarot (Thoth)", text: "Art (Temperance in Rider-Waite). Sagittarius, Hebrew letter Samekh. The alchemical marriage — combining opposites into a higher unity. The arrow aimed at the mark." },
      { sys: "Chaldean", text: "Movement, combination, and fortunate dealings with money, speculation, and changes in business. A beneficial compound number." },
      { sys: "Egyptian", text: "Osiris dismembered into 14 pieces by Set. The number of scattering before reconstitution — death preceding resurrection." },
    ],
  },
  {
    num: 15,
    meanings: [
      { sys: "Tarot (Thoth)", text: "The Devil. Capricorn, Hebrew letter Ayin ('Eye'). Creative energy in its most material and phallic form. Mirth, Pan, the goat-god. Not evil but the divine made flesh." },
      { sys: "Chaldean", text: "'The Magician.' Eloquence, gifts of music and art, occult significance, personal magnetism. One of the most fortunate compound numbers." },
      { sys: "Chinese", text: "The magic constant of the Luo Shu square — every row, column, and diagonal of the 3×3 grid sums to 15. Foundational to feng shui and Chinese cosmological numerics." },
    ],
  },
  {
    num: 16,
    meanings: [
      { sys: "Tarot (Thoth)", text: "The Tower. Mars, Hebrew letter Peh ('Mouth'). Destruction of false structures, lightning-flash of illumination, the war-god's demolition of the ego-fortress. Liberation through catastrophe." },
      { sys: "Chaldean", text: "'The Shattered Citadel.' Warning of downfall through overconfidence, accidents, defeat of plans. Considered one of the most dangerous compound numbers." },
      { sys: "Yoruba / Ifá", text: "16 principal Odù — the 16 mother-figures from which all 256 Odù are derived. The generative set of Ifá divination." },
      { sys: "Pythagorean", text: "Karmic Debt number. Reduces to 7, but the path through 16 implies ego-destruction, abuse of love in past lives, and the necessity of humility." },
    ],
  },
  {
    num: 17,
    meanings: [
      { sys: "Tarot (Thoth)", text: "The Star. Aquarius, Hebrew letter He (in Crowley's swap with IV/Tzaddi). Hope, revelation, the waters of consciousness poured upon earth. Nuit — the infinite stars." },
      { sys: "Christian", text: "Root of 153 (triangular number of 17). Augustine: 17 = 10 (the Law/Commandments) + 7 (the Gifts of the Spirit). Grace fulfilling the Law." },
      { sys: "Celtic", text: "Appears as a structuring number in the Fenian cycle. 17 companions, 17 years. A number of narrative significance in Irish saga literature." },
      { sys: "Chaldean", text: "'The Star of the Magi.' Immortality, spiritual legacy, the person's name living after them. Highly fortunate." },
    ],
  },
  {
    num: 18,
    meanings: [
      { sys: "Tarot (Thoth)", text: "The Moon. Pisces, Hebrew letter Qoph ('Back of head'). Illusion, the dark night of the soul, the path through fear and deception, the threshold of the unconscious." },
      { sys: "Hebrew / Kabbalah", text: "חי (Chai) = 8+10 = 18, meaning 'Life.' Gifts are given in multiples of 18 in Jewish tradition. L'chaim — 'To life!' — encoded in the number itself." },
      { sys: "Chaldean", text: "Conflict, deception, treachery from associates, danger from natural elements. But also spiritual warfare and the testing of the soul." },
    ],
  },
  {
    num: 19,
    meanings: [
      { sys: "Tarot (Thoth)", text: "The Sun. The Sun, Hebrew letter Resh ('Head'). Radiance, glory, the child reborn, the wall enclosing the graveyard — life and death unified in solar consciousness." },
      { sys: "Islamic", text: "The 'Quran code' number — Sura 74:30 states 'Over it are Nineteen.' A highly debated verse; Rashad Khalifa (1974) claimed the entire Quran is structured around mathematical patterns of 19. Controversial but influential." },
      { sys: "Chaldean", text: "'The Prince of Heaven.' One of the most fortunate numbers — success, happiness, honor, esteem. Promise of a brilliant future." },
      { sys: "Pythagorean", text: "Karmic Debt number. Reduces to 1, but through 19 — implying abuse of power in prior cycles, requiring self-sufficiency and independence." },
    ],
  },
  {
    num: 20,
    meanings: [
      { sys: "Tarot (Thoth)", text: "The Aeon (Judgement in Rider-Waite). Fire/Spirit, Hebrew letter Shin. The end of an age, the new Aeon of Horus, divine judgment as transformation. Stélé of Revealing." },
      { sys: "Mayan", text: "The base of the vigesimal number system. 20 day-signs (Imix through Ahau) form one axis of the Tzolkin calendar. The number of completeness in Mesoamerican counting — linked to the human body (fingers + toes)." },
      { sys: "Chaldean", text: "'The Awakening.' Also called 'the Judgement.' A call to action, spiritual awakening, purpose found after struggle." },
    ],
  },
  {
    num: 21,
    meanings: [
      { sys: "Tarot (Thoth)", text: "The Universe (The World in Rider-Waite). Saturn, Hebrew letter Tav. The completion of the Great Work, cosmic dance, the final integration of all elements. The last Major Arcanum." },
      { sys: "Chaldean", text: "'The Crown of the Magi.' Advancement, elevation, honors, supreme success. The most fortunate of all compound numbers." },
    ],
  },
  {
    num: 22,
    meanings: [
      { sys: "Pythagorean", text: "Master Number. The 'Master Builder.' Visionary ambition made material — the capacity to manifest on a massive scale. Intense pressure and potential." },
      { sys: "Hebrew / Kabbalah", text: "22 letters of the Hebrew alphabet = 22 paths on the Tree of Life connecting the 10 Sephiroth. The complete alphabet of creation — 'God created the world with 22 letters' (Sefer Yetzirah)." },
      { sys: "Tarot", text: "22 Major Arcana (0–XXI). The complete cycle of archetypal experience from the Fool's leap to the Universe's completion. The Fool's Journey." },
    ],
  },
  {
    num: 24,
    meanings: [
      { sys: "Christian", text: "The 24 Elders before the Throne in Revelation 4:4. Often interpreted as 12 patriarchs + 12 apostles — the complete witness of Old and New Covenants." },
      { sys: "Vedic", text: "24 syllables of the Gayatri Mantra, the most sacred verse of the Rigveda. Each syllable corresponds to a deity and a cosmic principle." },
    ],
  },
  {
    num: 26,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "יהוה (YHVH, the Tetragrammaton) = 10+5+6+5 = 26. The holiest number in Jewish mysticism — the unpronounceable Name of God. 26 = 2 × 13, linking God's Name to both Love (Ahavah=13) and Unity (Echad=13)." },
    ],
  },
  {
    num: 27,
    meanings: [
      { sys: "Celtic", text: "3³ = 27. Cú Chulainn's 27 feats of arms. The cube of the sacred triad — enchantment amplified to its fullest extension. A number of magical mastery." },
      { sys: "Vedic", text: "27 Nakshatras (lunar mansions) dividing the ecliptic in Jyotish. Each Nakshatra has a ruling deity, planet, and symbol. The Moon traverses one per day — foundational to Indian astrological timing." },
    ],
  },
  {
    num: 28,
    meanings: [
      { sys: "Neoplatonic", text: "The second perfect number (1+2+4+7+14 = 28). Associated with the lunar month (~28 days). Harmony of the moon, cyclical completion, embodied perfection." },
      { sys: "Islamic", text: "28 letters of the Arabic alphabet. 28 Manazil al-Qamar (lunar mansions) used in Islamic astral magic, each associated with a letter, an angel, and a talisman." },
    ],
  },
  {
    num: 32,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "32 Paths of Wisdom (Sefer Yetzirah) = 22 letters + 10 Sephiroth. The complete structure through which God created the universe. The number of Lev (לב), 'Heart.'" },
    ],
  },
  {
    num: 33,
    meanings: [
      { sys: "Pythagorean", text: "Master Number. The 'Master Teacher.' Selfless service, spiritual uplift, the Christ vibration. The rarest and most demanding of the Master Numbers." },
      { sys: "Christian", text: "Traditional age of Christ at the crucifixion and resurrection. 33 years = the complete arc of the incarnate life." },
      { sys: "Masonic", text: "33 degrees of the Scottish Rite. The highest regular degree — honorary, conferred for exceptional service. The number of supreme attainment within the order." },
    ],
  },
  {
    num: 36,
    meanings: [
      { sys: "Egyptian", text: "36 Decans — star-groups dividing the ecliptic into 10° segments, each ruling a 10-day 'week' (36 × 10 = 360-day year). The Decanal system was the basis of Egyptian astronomical religion, later absorbed into Hellenistic astrology." },
      { sys: "Hebrew / Kabbalah", text: "The Lamed-Vav Tzadikim: 36 hidden righteous ones whose merit sustains the world in every generation. Talmudic tradition (Sanhedrin 97b, Sukkah 45b). If even one were missing, the world would end." },
    ],
  },
  {
    num: 40,
    meanings: [
      { sys: "Christian", text: "The number of trial and testing. 40 days of the flood, 40 years in the desert, 40 days of Moses on Sinai, 40 days of Christ's temptation, 40 days of Lent. Probation before transformation." },
      { sys: "Islamic", text: "40 Hadith (Imam Nawawi's collection). Muhammad received revelation at age 40. The Quran mentions 40 nights of Moses on the mount. 40 = the age of spiritual maturity." },
      { sys: "Jewish", text: "40 se'ah = the minimum volume of a mikveh (ritual bath). 40 days from conception to formation. 40 = the measure of purification and transition." },
    ],
  },
  {
    num: 42,
    meanings: [
      { sys: "Egyptian", text: "42 Assessor Gods in the Hall of Ma'at — each presides over a specific sin in the Negative Confession. The deceased must deny wrongdoing before each of the 42 to pass into the afterlife." },
      { sys: "Hebrew / Kabbalah", text: "The 42-Letter Name of God (Ana BeKoach prayer). A powerful mystical formula composed of 42 letters arranged in 7 lines of 6 — used in Kabbalistic meditation and as a framework for creation." },
    ],
  },
  {
    num: 44,
    meanings: [
      { sys: "Pythagorean", text: "Sometimes treated as a Master Number (the 'Master Healer'). Practical mastery over the material world, building enduring structures. Debated — not universally recognized." },
    ],
  },
  {
    num: 50,
    meanings: [
      { sys: "Jewish", text: "The Jubilee year — every 50th year, debts forgiven, slaves freed, land returned (Leviticus 25). Also: 50 Gates of Understanding (Binah) in Kabbalistic tradition. Moses attained 49; the 50th is God's alone." },
      { sys: "Christian", text: "Pentecost — the 50th day after Easter. The descent of the Holy Spirit, the birth of the Church, the reversal of Babel." },
    ],
  },
  {
    num: 52,
    meanings: [
      { sys: "Mayan", text: "The Calendar Round = 52 Haab years = 73 Tzolkin cycles = 18,980 days. The great cycle after which the two calendars realign. Period-ending ceremonies included extinguishing all fires and drilling new flame — cosmic renewal." },
    ],
  },
  {
    num: 64,
    meanings: [
      { sys: "Chinese", text: "64 hexagrams of the I Ching (Yijing). Each hexagram = 6 yin/yang lines = 2⁶ combinations. The complete catalog of archetypal situations. King Wen's arrangement and the binary sequence both encode the system's totality." },
    ],
  },
  {
    num: 66,
    meanings: [
      { sys: "Arabic Abjad", text: "الله (Allah) = Alif(1) + Lam(30) + Lam(30) + Ha(5) = 66. The numeric signature of the Divine Name. Widely inscribed, used in amulets, and the basis of many dhikr (remembrance) practices." },
    ],
  },
  {
    num: 70,
    meanings: [
      { sys: "Christian", text: "70 elders of Israel. The 70 (or 72) nations in the Table of Nations (Genesis 10). 70 years of Babylonian exile. '70 × 7' = 490 = complete forgiveness (Matthew 18:22). The Septuagint translated by 70 (72) scholars." },
      { sys: "Jewish", text: "70 facets of Torah — each verse has 70 valid interpretations. The 70 members of the Sanhedrin. 70 names of God." },
    ],
  },
  {
    num: 72,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "The Shem HaMephorash — the 72-Letter Name of God, derived from three consecutive verses of Exodus (14:19–21), each of 72 letters. Yields 72 triads = 72 angelic names. One of the most elaborate structures in Kabbalistic theurgy." },
      { sys: "Egyptian", text: "72 forms or names of Ra in some late-period texts. Also: Set enlisted 72 conspirators to murder Osiris (Plutarch's account)." },
    ],
  },
  {
    num: 78,
    meanings: [
      { sys: "Tarot", text: "Total cards in a standard Tarot deck: 22 Major Arcana + 56 Minor Arcana (4 suits × 14 cards). 78 = the triangular number of 12 (sum of 1 through 12). The complete divinatory instrument." },
    ],
  },
  {
    num: 92,
    meanings: [
      { sys: "Arabic Abjad", text: "محمد (Muhammad) = Mim(40) + Ha(8) + Mim(40) + Dal(4) = 92. The numeric value of the Prophet's name, used in calligraphy, magic squares (awfaq), and chronograms." },
    ],
  },
  {
    num: 93,
    meanings: [
      { sys: "Thelemic", text: "The central number of Thelema. θελημα (Thelema, 'Will') = 9+5+30+8+40+1 = 93 in Greek isopsephy. ἀγάπη (Agape, 'Love') = 1+3+1+80+8 = 93. Therefore Will and Love are numerically identical — the doctrinal core of 'Do what thou wilt' and 'Love is the law, love under will.' '93' is used as a greeting among Thelemites." },
    ],
  },
  {
    num: 99,
    meanings: [
      { sys: "Islamic", text: "The 99 Names of God (al-Asma al-Husna). 'God has 99 names; whoever memorizes them enters Paradise' (hadith). Each Name carries a distinct divine attribute and an Abjad value; Sufi practice involves reciting specific Names for specific purposes." },
    ],
  },
  {
    num: 100,
    meanings: [
      { sys: "Christian", text: "The hundredfold return (Mark 10:30). The parable of the lost sheep (leaving 99 to find the 1). Fullness of reward, the complete flock." },
      { sys: "Dante", text: "100 cantos in the Divine Comedy: 1 (introduction) + 33 (Inferno) + 33 (Purgatorio) + 33 (Paradiso). The perfection of 10² containing the Trinitarian 33." },
    ],
  },
  {
    num: 108,
    meanings: [
      { sys: "Vedic / Hindu-Buddhist", text: "Sacred across Hinduism, Buddhism, and Jainism. 108 beads on a mala (prayer necklace). 108 Upanishads. 108 names of each major deity. Mathematically: 1¹ × 2² × 3³ = 108. Also: the Sun's diameter × 108 ≈ the Sun-Earth distance. The number encodes cosmological ratios at multiple scales." },
    ],
  },
  {
    num: 137,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "Gematria of קבלה (Kabbalah) = 100+2+30+5 = 137. Also the age of Ishmael (Genesis 25:17). Intriguingly, 1/137 ≈ the fine-structure constant in physics — a coincidence that fascinated Pauli and Eddington and continues to attract numerological attention." },
    ],
  },
  {
    num: 144,
    meanings: [
      { sys: "Christian", text: "12² = 144. Foundation measurement of the New Jerusalem (Revelation 21:17) — 144 cubits. The square of divine governance, the geometry of the perfected city." },
    ],
  },
  {
    num: 153,
    meanings: [
      { sys: "Christian", text: "The miraculous catch of fish (John 21:11). Augustine's famous analysis: 153 = the triangular number of 17 = sum of 1 through 17, where 17 = 10 (the Commandments) + 7 (the Gifts of the Spirit). Therefore 153 = the totality of those gathered by the net of Grace. Also: 153 = 1³ + 5³ + 3³ (a narcissistic number)." },
    ],
  },
  {
    num: 156,
    meanings: [
      { sys: "Thelemic", text: "The number of Babalon, the Scarlet Woman — the Thelemic goddess of liberated desire and sacred sexuality. בבלון in Hebrew gematria. Also = the sum of the first 12 numbers squared (disputed). Central to the symbolism of the Abyss and the cup of Babalon." },
    ],
  },
  {
    num: 168,
    meanings: [
      { sys: "Chinese", text: "'一路发' (yī lù fā) — phonetically 'all the way to prosperity.' A highly auspicious number for prices, addresses, and phone numbers. Combines 1 (certainty) + 6 (smooth) + 8 (prosper)." },
    ],
  },
  {
    num: 216,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "72 × 3 = 216. The total number of letters in the Shem HaMephorash (72 triads of 3 letters each). Also 6³ = 216 — the cube of the human number. Some traditions identify 216 as the 'hidden name of God' referenced in Talmudic literature (Kiddushin 71a)." },
    ],
  },
  {
    num: 220,
    meanings: [
      { sys: "Thelemic", text: "The number of verses in Liber AL vel Legis (The Book of the Law) — the central scripture of Thelema, received by Crowley in Cairo, 1904. 220 = the number assigned to the Book as a whole in the A∴A∴ catalog." },
    ],
  },
  {
    num: 231,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "231 Gates — the number of unique letter-pairs from the 22 Hebrew letters (22 choose 2 = 231). Described in the Sefer Yetzirah as the 'gates' through which God combined letters to create all things. The 231 Gates form a complete graph of creation's combinatorial structure." },
    ],
  },
  {
    num: 248,
    meanings: [
      { sys: "Jewish", text: "248 positive commandments in the Torah (by Talmudic enumeration) = the number of limbs and organs in the human body (Talmud, Makkot 23b). Each limb corresponds to a commandment — the body is a map of divine law." },
    ],
  },
  {
    num: 250,
    meanings: [
      { sys: "Chinese", text: "二百五 (èr bǎi wǔ) = a common insult meaning 'idiot' or 'simpleton.' Origin debated (possibly related to an ancient unit of currency for bribes). The number is actively avoided in pricing, gifts, and numbering." },
    ],
  },
  {
    num: 256,
    meanings: [
      { sys: "Yoruba / Ifá", text: "16² = 256 = 2⁸. The total number of Odù in the Ifá corpus — every possible combination of the 16 principal figures paired two at a time. A complete 8-bit binary space. The 256 Odù constitute a recognized UNESCO Masterpiece of Oral and Intangible Heritage." },
    ],
  },
  {
    num: 260,
    meanings: [
      { sys: "Mayan", text: "The Tzolkin sacred calendar = 13 × 20 = 260 days. Each day is a unique combination of a number (1–13) and a day-sign (1 of 20). Possibly linked to: human gestation (~260 days), the agricultural cycle in Maya highlands, and the interval between zenith-sun passages at 14.8°N latitude. The fundamental cycle of Mesoamerican time-keeping." },
    ],
  },
  {
    num: 318,
    meanings: [
      { sys: "Christian", text: "Abram's 318 trained servants who rescued Lot (Genesis 14:14). The Epistle of Barnabas (2nd c.) reads 318 in Greek numerals as ΤΙΗ: Τ (300) = the cross, ΙΗ (18) = the first two letters of Ιησους (Jesus). Therefore Abraham's 318 servants prefigure salvation through the cross of Jesus — an early example of Christian numerical typology." },
    ],
  },
  {
    num: 343,
    meanings: [
      { sys: "Neoplatonic / Mathematical", text: "7³ = 343. The cube of the sacred Heptad. In Plato's Timaeus, the Demiurge constructs the World Soul using a series that includes cubes of 2 and 3 (8 and 27); later Neoplatonists extended this attention to all cubes of significant numbers." },
    ],
  },
  {
    num: 354,
    meanings: [
      { sys: "Islamic", text: "Approximately 354 days in a lunar year (12 synodic months). The Islamic calendar is purely lunar and ~11 days shorter than the solar year — festivals migrate through the seasons over a ~33-year cycle. The number encodes the rhythmic structure of Islamic sacred time." },
    ],
  },
  {
    num: 358,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "משיח (Mashiach, 'Messiah') = 40+300+10+8 = 358. נחש (Nachash, 'Serpent') = 50+8+300 = 358. One of the most famous and provocative gematria equivalences: the Redeemer and the Tempter share the same numeric essence. Kabbalistic interpretation: the Messiah comes by transforming the very energy of the Serpent — redemption from within the fall." },
    ],
  },
  {
    num: 360,
    meanings: [
      { sys: "Egyptian", text: "36 decans × 10 days = 360, the 'ideal year' to which 5 epagomenal days were added. The 360° circle originates in this Babylonian/Egyptian calendrical logic." },
      { sys: "Mayan", text: "1 Tun = 360 days = 18 Uinals of 20 days. The basic unit of the Long Count calendar, approximating a solar year." },
      { sys: "Neoplatonic", text: "A 'highly composite' number with 24 factors — more divisors than any smaller number. Proclus and others considered this a sign of cosmic harmony. 360 = the degrees of the circle, the completeness of revolution." },
    ],
  },
  {
    num: 365,
    meanings: [
      { sys: "Greek / Gnostic", text: "Αβρασαξ (Abraxas) = 1+2+100+1+200+1+60 = 365. The supreme Gnostic deity whose name encodes the solar year. Ruler of the 365 heavens in Basilidean Gnosticism. Carved on amulets throughout late antiquity." },
      { sys: "Mayan", text: "1 Haab = 365 days (18 months of 20 days + 5 Wayeb days). The solar calendar, running alongside the 260-day Tzolkin." },
    ],
  },
  {
    num: 400,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "Value of Tav (ת), the 22nd and final Hebrew letter. The mark, the cross, the seal, completion of the alphabet. 'From Aleph to Tav' = from 1 to 400 = the full range of created reality. Esau's 400 men (Genesis 33:1). 400 years of sojourn in Egypt." },
    ],
  },
  {
    num: 418,
    meanings: [
      { sys: "Thelemic", text: "אברהדברא (Abrahadabra) — the 'Word of the Aeon' in Thelema. The formula of the Great Work: the union of 5 (pentagram/microcosm) and 6 (hexagram/macrocosm). 418 = Abrahadabra in Hebrew gematria. Crowley called it 'the reward of Ra-Hoor-Khuit' and the key to all ritual magick." },
    ],
  },
  {
    num: 432,
    meanings: [
      { sys: "Vedic", text: "The Kali Yuga (current age of decline) = 432,000 years. The full Mahayuga = 4,320,000 years (432 × 10,000). The ratio 4:3:2:1 structures the four Yugas. 432 also = the frequency (Hz) some claim is the 'natural tuning' of A (debated, but widely held in alternative music theory)." },
    ],
  },
  {
    num: 490,
    meanings: [
      { sys: "Christian", text: "70 × 7 = 490. Christ's answer to Peter's question about forgiveness (Matthew 18:22): not seven times, but seventy times seven — complete, unlimited forgiveness. Also: Daniel's 70 weeks (Daniel 9:24) = 490 years = the prophetic timeline to the Messiah." },
    ],
  },
  {
    num: 496,
    meanings: [
      { sys: "Neoplatonic / Mathematical", text: "The third perfect number (1+2+4+8+16+31+62+124+248 = 496). After 6 and 28, the next number equal to the sum of its proper divisors. Discussed by Nicomachus and Iamblichus as embodying cosmic perfection at a higher octave. In modern physics: 496 is the dimension of SO(32) and E₈×E₈ — the gauge groups of consistent superstring theories." },
    ],
  },
  {
    num: 514,
    meanings: [
      { sys: "Chinese", text: "五一四 (wǔ yī sì) sounds like 'I will die' (我要死, wǒ yào sǐ). Aggressively avoided in phone numbers, prices, addresses, and identification numbers." },
    ],
  },
  {
    num: 545,
    meanings: [
      { sys: "Greek / Isopsephy", text: "Preserved in Pompeii graffiti: 'I love the one whose number is 545.' An ancient love-riddle — the beloved's name (now unknown) had this isopsephic value. Evidence of popular numerological practice in everyday Roman life." },
    ],
  },
  {
    num: 616,
    meanings: [
      { sys: "Christian / Textual", text: "Papyrus 115 (the earliest surviving fragment of Revelation 13) gives the Number of the Beast as 616, not 666. Irenaeus (2nd c.) knew of this variant and argued for 666. 616 may encode 'Gaius Caesar' (Caligula) in Hebrew gematria, while 666 = 'Neron Kaiser.' The textual uncertainty itself became theologically significant." },
    ],
  },
  {
    num: 666,
    meanings: [
      { sys: "Christian", text: "The Number of the Beast (Revelation 13:18): 'Let him who has understanding calculate the number... it is the number of a man.' The most famous numerological puzzle in Western civilization." },
      { sys: "Greek / Isopsephy", text: "Νερων Καισαρ (Neron Kaisar) transliterated into Hebrew (נרון קסר) = 50+200+6+50+100+60+200 = 666. This is the scholarly consensus decoding, though alternatives abound (Lateinos, Teitan, etc.)." },
      { sys: "Thelemic", text: "Crowley's self-identification: Τὸ Μέγα Θηρίον (To Mega Therion, 'The Great Beast') = 666 in Greek isopsephy. Embraced as a number of solar divinity rather than evil." },
      { sys: "Neoplatonic", text: "The sum of all numbers on a 6×6 magic square (associated with the Sun in planetary magic). The 'solar number.' Medieval and Renaissance magi used it in talismanic construction." },
    ],
  },
  {
    num: 700,
    meanings: [
      { sys: "Hebrew / Kabbalah", text: "Value of final Nun sofit (ן) in the extended gematria system. Nun = the fish, the concealed, the faithful — magnified in its final form. Also: 700 years of the Sabbatical cosmic cycle in some Kabbalistic chronologies." },
    ],
  },
  {
    num: 777,
    meanings: [
      { sys: "Thelemic", text: "Title of Crowley's master correspondence table (Liber 777), mapping every number, letter, god, color, perfume, plant, etc. to the Tree of Life. Also: 777 = the lightning flash descending through the 3 Sephirotic triads. The 'flaming sword' of creation." },
      { sys: "Christian", text: "Lamech's age at death (Genesis 5:31). Sometimes interpreted as the divine antithesis of 666 — sevenfold perfection tripled. God's completeness vs. the Beast's incompleteness." },
    ],
  },
  {
    num: 786,
    meanings: [
      { sys: "Arabic Abjad", text: "بسم الله الرحمن الرحيم (Bismillah al-Rahman al-Rahim, 'In the Name of God, the Most Compassionate, the Most Merciful') = 786 in Abjad numerals. Widely used as a sacred abbreviation across the Islamic world — inscribed on letters, documents, buildings, and amulets. Writing '786' substitutes for writing the full Basmala." },
    ],
  },
  {
    num: 800,
    meanings: [
      { sys: "Greek / Isopsephy", text: "Value of Omega (Ω), the last letter of the Greek alphabet. 'I am the Alpha and the Omega' — the span from 1 to 800 encompasses all meaning. Also the value of final Peh sofit (ף) = 800 in extended Hebrew gematria." },
    ],
  },
  {
    num: 888,
    meanings: [
      { sys: "Greek / Isopsephy", text: "Ἰησοῦς (Iesous, 'Jesus') = 10+8+200+70+400+200 = 888. This was recognized by early Christians and Gnostics as deeply significant: 888 vs. 666, Christ vs. the Beast. The Sibylline Oracles encode it as 'four times one hundred, twice ten, and thrice eight.'" },
      { sys: "Chinese", text: "Triple 8 = triple prosperity. Among the most auspicious possible number combinations. The Beijing Olympics began on 08/08/08 at 8:08:08 PM." },
    ],
  },
  {
    num: 999,
    meanings: [
      { sys: "Chinese", text: "九九九 (jiǔ jiǔ jiǔ) — triple 'long-lasting.' Extremely auspicious for longevity and endurance. The Forbidden City contains 9,999 rooms (traditionally)." },
      { sys: "Pythagorean / Western", text: "Triple completion. Sometimes interpreted as the end of a grand cycle, the final moment before return to 1. Used in modern 'angel number' systems as a sign of conclusion and release." },
    ],
  },
  {
    num: 1000,
    meanings: [
      { sys: "Christian", text: "The Millennium — Christ's thousand-year reign (Revelation 20:1–6). Whether literal or symbolic has been debated since Origen and Augustine. The 'chiliasm' question shaped Christian eschatology for two millennia." },
      { sys: "Arabic Abjad", text: "Value of Ghayn (غ), the last letter in the Abjad sequence. The full Abjad spans 1–1000, encompassing all created reality in 28 letters." },
    ],
  },
  {
    num: 1080,
    meanings: [
      { sys: "Sacred Geometry", text: "Radius of the Moon in miles ≈ 1,080. 1080 = 3 × 360. In John Michell's geomatic tradition, 1080 represents the lunar/feminine principle, paired with 666 (solar/masculine). Their sum (1746) and product feature in temple geometry analyses." },
    ],
  },
  {
    num: 1260,
    meanings: [
      { sys: "Christian", text: "The duration of prophetic witness and tribulation in Revelation: 1,260 days (Rev. 11:3, 12:6) = 42 months of 30 days = 3½ years. Half of 7 — the broken week, the time of persecution before restoration." },
    ],
  },
  {
    num: 1728,
    meanings: [
      { sys: "Mathematical / Esoteric", text: "12³ = 1,728. The cube of cosmic order. 1,728,000 years = the duration of the Satya Yuga (Vedic golden age) = 4 × 432,000. The number bridges Pythagorean solid geometry (the cube) and Vedic time cycles." },
    ],
  },
  {
    num: 1746,
    meanings: [
      { sys: "Sacred Geometry", text: "In the tradition of John Michell and geomatic numerology: 1,746 = 666 + 1,080 = the fusion of solar and lunar principles. The perimeter of the 'New Jerusalem' diagram, a geometric archetype found (Michell argues) encoded in Stonehenge, the Great Pyramid, and Revelation 21." },
    ],
  },
  {
    num: 4320,
    meanings: [
      { sys: "Vedic", text: "The Mahayuga = 4,320,000 years (4,320 × 1,000). The four Yugas in ratio 4:3:2:1 sum to this cycle. Also: 4,320 = 6! (720) × 6. The number appears independently in Norse mythology: 432,000 warriors march out of Valhalla (800 from each of 540 doors) at Ragnarök — a parallel that has fascinated comparative mythologists since de Santillana and von Dechend (Hamlet's Mill, 1969)." },
    ],
  },
  {
    num: 12960000,
    meanings: [
      { sys: "Platonic", text: "Plato's 'Nuptial Number' (Republic VIII, 546b–d) — one of the most debated passages in all of Western philosophy. The number governs the cycles of good and bad births in the ideal city. Most scholars reconstruct it as 12,960,000 = 3⁶ × 4⁴ × 5⁴ = (3600)². Despite 2,400 years of commentary, there is still no consensus on how to read the passage." },
    ],
  },
  {
    num: 18980,
    meanings: [
      { sys: "Mayan", text: "The Calendar Round = 18,980 days = 52 Haab years = 73 Tzolkin cycles. The least common multiple of 260 and 365. Every 18,980 days the two calendars realign — the 'century' of Mesoamerican time, accompanied by New Fire ceremonies." },
    ],
  },
  {
    num: 144000,
    meanings: [
      { sys: "Christian", text: "The 144,000 'sealed' of Revelation 7:4 — 12,000 from each of the 12 tribes of Israel. 144,000 = 12² × 10³. Whether these are a literal elect or symbolic totality has generated vast theological debate. Jehovah's Witnesses interpret the number literally; most other traditions read it as the fullness of the redeemed." },
    ],
  },
];

const allSystems = [...new Set(entries.flatMap((e) => e.meanings.map((m) => m.sys)))].sort();

const sysColors = {
  "Tarot (Thoth)": "#8B5CF6",
  "Tarot": "#8B5CF6",
  "Chaldean": "#D97706",
  "Egyptian": "#B45309",
  "Yoruba / Ifá": "#059669",
  "Pythagorean": "#2563EB",
  "Pythagorean / Western": "#2563EB",
  "Islamic": "#0D9488",
  "Christian": "#DC2626",
  "Christian / Textual": "#DC2626",
  "Jewish": "#7C3AED",
  "Hebrew / Kabbalah": "#7C3AED",
  "Mayan": "#65A30D",
  "Chinese": "#E11D48",
  "Arabic Abjad": "#0891B2",
  "Vedic": "#CA8A04",
  "Vedic / Hindu-Buddhist": "#CA8A04",
  "Thelemic": "#9333EA",
  "Neoplatonic": "#6366F1",
  "Neoplatonic / Mathematical": "#6366F1",
  "Celtic": "#16A34A",
  "Greek / Isopsephy": "#EA580C",
  "Greek / Gnostic": "#EA580C",
  "Dante": "#78716C",
  "Masonic": "#57534E",
  "Sacred Geometry": "#64748B",
  "Mathematical / Esoteric": "#64748B",
  "Platonic": "#6366F1",
};

function getColor(sys) {
  if (sysColors[sys]) return sysColors[sys];
  for (const key of Object.keys(sysColors)) {
    if (sys.includes(key) || key.includes(sys)) return sysColors[key];
  }
  return "#71717A";
}

export default function NumberIndex() {
  const [filter, setFilter] = useState("");
  const [expandedNum, setExpandedNum] = useState(null);
  const [sysFilter, setSysFilter] = useState(null);

  const filtered = useMemo(() => {
    let result = entries;
    if (sysFilter) {
      result = result
        .map((e) => ({
          ...e,
          meanings: e.meanings.filter((m) => m.sys === sysFilter),
        }))
        .filter((e) => e.meanings.length > 0);
    }
    if (filter) {
      const q = filter.toLowerCase();
      result = result.filter(
        (e) =>
          String(e.num).includes(q) ||
          e.meanings.some(
            (m) =>
              m.sys.toLowerCase().includes(q) ||
              m.text.toLowerCase().includes(q)
          )
      );
    }
    return result;
  }, [filter, sysFilter]);

  return (
    <div
      style={{
        fontFamily:
          "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
        background: "#0a0a0c",
        color: "#d4cfc4",
        minHeight: "100vh",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; }

        .title-area { margin-bottom: 20px; padding: 0 4px; }
        .title-area h1 {
          font-size: 22px; font-weight: 300; color: #c9a96e;
          letter-spacing: 2px; text-transform: uppercase; margin: 0 0 6px;
        }
        .title-area p {
          font-size: 12px; color: #6a6050; margin: 0; font-style: italic;
        }

        .controls {
          display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
          align-items: center; padding: 0 4px;
        }

        .search-input {
          background: #141210; border: 1px solid #2a2520; border-radius: 2px;
          color: #d4cfc4; padding: 8px 14px; font-size: 13px;
          font-family: 'Cormorant Garamond', serif; width: 260px;
          outline: none;
        }
        .search-input:focus { border-color: #8b7355; }
        .search-input::placeholder { color: #4a4540; }

        .sys-filter-btn {
          background: #141210; border: 1px solid #2a2520; border-radius: 2px;
          color: #8a8070; padding: 5px 10px; font-size: 11px; cursor: pointer;
          font-family: 'JetBrains Mono', monospace; transition: all 0.15s;
        }
        .sys-filter-btn:hover { border-color: #8b7355; color: #c9a96e; }
        .sys-filter-btn.active { border-color: #c9a96e; color: #c9a96e; background: #1a1714; }

        .count-note {
          font-size: 11px; color: #5a5040; font-family: 'JetBrains Mono', monospace;
          margin-left: auto;
        }

        .num-list {
          display: flex; flex-direction: column; gap: 2px;
        }

        .num-entry {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 12px 16px; border-left: 2px solid #1a1815;
          cursor: pointer; transition: background 0.12s;
        }
        .num-entry:hover { background: #12110f; border-left-color: #3a3530; }
        .num-entry.expanded { background: #141210; border-left-color: #c9a96e; }

        .num-value {
          font-family: 'JetBrains Mono', monospace; font-size: 24px;
          font-weight: 300; color: #c9a96e; min-width: 90px; text-align: right;
          line-height: 1; padding-top: 2px; flex-shrink: 0;
        }
        .num-value.large { font-size: 16px; }

        .num-body { flex: 1; min-width: 0; }

        .sys-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
        .sys-tag {
          font-size: 9.5px; font-family: 'JetBrains Mono', monospace;
          padding: 2px 7px; border-radius: 2px; letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .meaning-preview {
          font-size: 12px; color: #8a8070; line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        .meanings-expanded {
          display: flex; flex-direction: column; gap: 14px; margin-top: 8px;
        }

        .meaning-block { padding-left: 0; }
        .meaning-sys {
          font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .meaning-text {
          font-size: 13.5px; line-height: 1.65; color: #c4bfb4;
        }

        .divider {
          height: 1px; background: #1a1815; margin: 12px 0 12px 106px;
        }
      `}</style>

      <div className="title-area">
        <h1>Index of Significant Numbers</h1>
        <p>
          {entries.reduce((a, e) => a + e.meanings.length, 0)} meanings across{" "}
          {entries.length} numbers — from Tarot to Torah, the Tzolkin to
          Thelema
        </p>
      </div>

      <div className="controls">
        <input
          className="search-input"
          placeholder="Search by number, system, or keyword…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {[
          "Tarot (Thoth)",
          "Hebrew / Kabbalah",
          "Christian",
          "Chinese",
          "Arabic Abjad",
          "Thelemic",
          "Mayan",
          "Vedic",
          "Chaldean",
          "Greek / Isopsephy",
        ].map((s) => (
          <button
            key={s}
            className={`sys-filter-btn ${sysFilter === s ? "active" : ""}`}
            onClick={() => setSysFilter(sysFilter === s ? null : s)}
          >
            {s.split("/")[0].trim().split("(")[0].trim()}
          </button>
        ))}
        <span className="count-note">
          {filtered.length} number{filtered.length !== 1 ? "s" : ""} shown
        </span>
      </div>

      <div className="num-list">
        {filtered.map((entry, i) => {
          const isExpanded = expandedNum === entry.num;
          const numStr = entry.num.toLocaleString();

          return (
            <div key={entry.num}>
              <div
                className={`num-entry ${isExpanded ? "expanded" : ""}`}
                onClick={() =>
                  setExpandedNum(isExpanded ? null : entry.num)
                }
              >
                <div
                  className={`num-value ${numStr.length > 5 ? "large" : ""}`}
                >
                  {numStr}
                </div>
                <div className="num-body">
                  <div className="sys-tags">
                    {entry.meanings.map((m) => (
                      <span
                        key={m.sys}
                        className="sys-tag"
                        style={{
                          color: getColor(m.sys),
                          background: getColor(m.sys) + "18",
                          border: `1px solid ${getColor(m.sys)}30`,
                        }}
                      >
                        {m.sys}
                      </span>
                    ))}
                  </div>
                  {!isExpanded && (
                    <div className="meaning-preview">
                      {entry.meanings[0].text}
                    </div>
                  )}
                  {isExpanded && (
                    <div className="meanings-expanded">
                      {entry.meanings.map((m) => (
                        <div key={m.sys} className="meaning-block">
                          <div
                            className="meaning-sys"
                            style={{ color: getColor(m.sys) }}
                          >
                            {m.sys}
                          </div>
                          <div className="meaning-text">{m.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {i < filtered.length - 1 && <div className="divider" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
