var questionSet = {
    book: "John",
    chapters: [
        ["Then Jesus six days before the passover came to Bethany, where Lazarus was which had been dead, whom he raised from the dead.", "There they made him a supper; and Martha served: but Lazarus was one of them that sat at the table with him.", "Then took Mary a pound of ointment of spikenard, very costly, and anointed the feet of Jesus, and wiped his feet with her hair: and the house was filled with the odour of the ointment.", "Then saith one of his disciples, Judas Iscariot, Simon’s son, which should betray him,", "Why was not this ointment sold for three hundred pence, and given to the poor?", "This he said, not that he cared for the poor; but because he was a thief, and had the bag, and bare what was put therein.", "Then said Jesus, Let her alone: against the day of my burying hath she kept this.", "For the poor always ye have with you; but me ye have not always.", "Much people of the Jews therefore knew that he was there: and they came not for Jesus’ sake only, but that they might see Lazarus also, whom he had raised from the dead.", "But the chief priests consulted that they might put Lazarus also to death;", "Because that by reason of him many of the Jews went away, and believed on Jesus.", "On the next day much people that were come to the feast, when they heard that Jesus was coming to Jerusalem,", "Took branches of palm trees, and went forth to meet him, and cried, Hosanna: Blessed is the King of Israel that cometh in the name of the Lord.", "And Jesus, when he had found a young ass, sat thereon; as it is written,", "Fear not, daughter of Sion: behold, thy King cometh, sitting on an ass’s colt.", "These things understood not his disciples at the first: but when Jesus was glorified, then remembered they that these things were written of him, and that they had done these things unto him.", "The people therefore that was with him when he called Lazarus out of his grave, and raised him from the dead, bare record.", "For this cause the people also met him, for that they heard that he had done this miracle.", "The Pharisees therefore said among themselves, Perceive ye how ye prevail nothing? behold, the world is gone after him.", "And there were certain Greeks among them that came up to worship at the feast:", "The same came therefore to Philip, which was of Bethsaida of Galilee, and desired him, saying, Sir, we would see Jesus.", "Philip cometh and telleth Andrew: and again Andrew and Philip tell Jesus.", "And Jesus answered them, saying, The hour is come, that the Son of man should be glorified.", "Verily, verily, I say unto you, Except a corn of wheat fall into the ground and die, it abideth alone: but if it die, it bringeth forth much fruit.", "He that loveth his life shall lose it; and he that hateth his life in this world shall keep it unto life eternal.", "If any man serve me, let him follow me; and where I am, there shall also my servant be: if any man serve me, him will my Father honour.", "Now is my soul troubled; and what shall I say? Father, save me from this hour: but for this cause came I unto this hour.", "Father, glorify thy name. Then came there a voice from heaven, saying, I have both glorified it, and will glorify it again.", "The people therefore, that stood by, and heard it, said that it thundered: others said, An angel spake to him.", "Jesus answered and said, This voice came not because of me, but for your sakes.", "Now is the judgment of this world: now shall the prince of this world be cast out.", "And I, if I be lifted up from the earth, will draw all men unto me.", "This he said, signifying what death he should die.", "The people answered him, We have heard out of the law that Christ abideth for ever: and how sayest thou, The Son of man must be lifted up? who is this Son of man?", "Then Jesus said unto them, Yet a little while is the light with you. Walk while ye have the light, lest darkness come upon you: for he that walketh in darkness knoweth not whither he goeth.", "While ye have light, believe in the light, that ye may be the children of light. These things spake Jesus, and departed, and did hide himself from them.", "But though he had done so many miracles before them, yet they believed not on him:", "That the saying of Esaias the prophet might be fulfilled, which he spake, Lord, who hath believed our report? and to whom hath the arm of the Lord been revealed?", "Therefore they could not believe, because that Esaias said again,", "He hath blinded their eyes, and hardened their heart; that they should not see with their eyes, nor understand with their heart, and be converted, and I should heal them.", "These things said Esaias, when he saw his glory, and spake of him.", "Nevertheless among the chief rulers also many believed on him; but because of the Pharisees they did not confess him, lest they should be put out of the synagogue:", "For they loved the praise of men more than the praise of God.", "Jesus cried and said, He that believeth on me, believeth not on me, but on him that sent me.", "And he that seeth me seeth him that sent me.", "I am come a light into the world, that whosoever believeth on me should not abide in darkness.", "And if any man hear my words, and believe not, I judge him not: for I came not to judge the world, but to save the world.", "He that rejecteth me, and receiveth not my words, hath one that judgeth him: the word that I have spoken, the same shall judge him in the last day.", "For I have not spoken of myself; but the Father which sent me, he gave me a commandment, what I should say, and what I should speak.", "And I know that his commandment is life everlasting: whatsoever I speak therefore, even as the Father said unto me, so I speak."],
    ],
    answersLocked: false,
    curChapter: 1,
    chapterRequired: false,
    curVerse: 1,
    curVerseText: "God, who at sundry times and in divers manners spake in time past unto the fathers by the prophets,",
    verseRange: "12-30",
    chapterRange: "1",
    verifyAnswer: function (answer) {
        answer = answer.split(".");
        if(answer.length === 2) {
            if(answer[0] == questionSet.curChapter && answer[1] == questionSet.curVerse) {
                return true;
            }
        } else {
            if (questionSet.chapterRequired) {
                return false;
            } else if(answer[0] == questionSet.curVerse) {
                return true;
            }
        }
    },
    chooseNewVerse: function() {
        var chapterRange = questionSet.chapterRange.split("-");
        var verseRange = questionSet.verseRange.split("-");
        if(chapterRange.length === 2) {
            questionSet.curChapter = randInt(Number(chapterRange[0]), Number(chapterRange[1]));
        }
        var lastVerse = questionSet.curVerse;
        do {
            questionSet.curVerse = randInt(Number(verseRange[0]), Number(verseRange[1]));
        } while (lastVerse === questionSet.curVerse);
        questionSet.curVerseText = questionSet.chapters[questionSet.curChapter-1][questionSet.curVerse-1];
        return questionSet.curVerseText;
    },
    returnCorrectAnswer: function() {
        return questionSet.curChapter + "." + questionSet.curVerse;
    }
}
