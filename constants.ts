
import { GameMode, Question, QuestionType } from './types';

export const GAME_MODES: { mode: GameMode, description: string }[] = [
    { mode: GameMode.FirstDate, description: "Light & fun icebreakers" },
    { mode: GameMode.SecondDate, description: "Slightly deeper prompts" },
    { mode: GameMode.ThirdDate, description: "Emotional and intimate" },
    { mode: GameMode.LoveBirds, description: "For established couples" },
    { mode: GameMode.GroupMode, description: "Spicy, humorous & open-ended" },
];

export const QUESTIONS: Question[] = [
    // First Date
    { text: "What's your biggest ick?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "How long do you know your best friend?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "Is there a song that immediately lifts your mood? Which one?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "What gives you the ick, no matter how attractive they are?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "What are your goals for this year?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "What is your favorite feature about yourself?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "How do you like to spend your alone time?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "If there was a Google review for dating you, what would it say?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "What's the funniest way someone has tried to seduce you?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "Name three things you like about your partner.", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "What is your love language for both giving and receiving love? (Physical Touch, Words of Affirmation, Quality Time, Acts of Service, Receiving Gifts).", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "What do you value most in a friendship?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "What was your first impression of me? Digital and in real life.", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "Describe your idea of a perfect day.", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "On a scale of 1 to 10, how would you rate yourself?", mode: GameMode.FirstDate, type: QuestionType.Question },
    { text: "If you received €10,000, how would you spend it?", mode: GameMode.FirstDate, type: QuestionType.Question },
    
    // Second Date
    { text: "What's your Roman Empire?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What's a deeply held dream you have?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What does your five year plan look like?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What were the major turning points in your life?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What lie have you told yourself so much that you now believe it?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "Is there anyone you look up to? Who and why?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What's your biggest fear?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "How do you define success?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What's something you wish I did more often?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What were you like as a student?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What's the most embarrassing that has happened to you?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "What did you want to be when you grew up?", mode: GameMode.SecondDate, type: QuestionType.Question },
    { text: "Which personal accomplishment are you most proud of? Why?", mode: GameMode.SecondDate, type: QuestionType.Question },

    // Third Date
    { text: "When was the last time a scent reminded you of a childhood memory? Share that story with me.", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "When do you feel the most insecure?", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "If you could relive one year of your life, which would it be and why?", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "What's something you wish you were really good at?", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "Both write down your three most important values in life. Compare.", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "Describe yourself in three words.", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "What does your dream house look like? Where is it?", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "If you could give one piece of advice to your younger self, what would it be?", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "How have you changed in the past five years?", mode: GameMode.ThirdDate, type: QuestionType.Question },
    { text: "What did you learn about money from your parents?", mode: GameMode.ThirdDate, type: QuestionType.Question },
    
    // Love Birds
    { text: "What feelings are hard for you to communicate? How can I make it easier?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "Do you ever feel jealous if you see me talking to other attractive people?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "What's the best thing you inherited from each of your parents?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "Is there someone to whom you owe an apology? What for?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "When you experience stress how do you like to be supported?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "What's something you love about your hometown?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "Express gratitude for the person you're with. Why are you thankful for them?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "What boundaries can we set to protect our relationship and communication from being damaged by technology?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "What's something I introduced you to that you now enjoy?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "Is there something you've always wanted to do? What's stopped you?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    { text: "What was the most recent experience that made you feel closer to me?", mode: GameMode.LoveBirds, type: QuestionType.Question },
    
    // Group Mode
    { text: "Who was the best sexual partner you ever had?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "If you had to trade lives with someone in this room, who would it be and why?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "What's a secret you've never told anyone here?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "What's the most illegal thing you've ever done?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Who in this room would survive the longest in a zombie apocalypse?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Describe a turn-on you haven't shared with me yet.", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "What's your favourite time of day for sex?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Which celebrity would you choose if you had a free pass to sleep with anyone?", mode: GameMode.GroupMode, type: QuestionType.Question },
    
    // Would You Rather Questions
    { text: "Would you rather have the ability to read minds or be invisible?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Would you rather have your browser history made public or your bank account balance displayed above your head?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Would you rather only be able to whisper or only be able to shout for the rest of your life?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Would you rather fight one horse-sized duck or 100 duck-sized horses?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Would you rather know the date of your death or the cause of your death?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Would you rather have unlimited money but no close relationships, or amazing relationships but always struggle financially?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Would you rather always be 10 minutes late or 20 minutes early to everything?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Would you rather have to sing everything you say or dance everywhere you go?", mode: GameMode.GroupMode, type: QuestionType.Question },
    
    // Rating/Scaling Questions
    { text: "On a scale of 1-10, how likely are you to survive a horror movie? Explain your strategy.", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Rate everyone in this room from 1-10 on who would make the best reality TV star. Explain why.", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "On a scale of 1-10, how much of a risk-taker are you? Give an example.", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Rate your cooking skills from 1-10. What's the most impressive dish you can make?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "On a scale of 1-10, how good are you at keeping secrets? Has anyone here tested this?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Rate your texting game from 1-10. Are you a quick replier or do you leave people on read?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "On a scale of 1-10, how competitive are you? What brings out your competitive side the most?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Rate your dance moves from 1-10. Show us your signature move!", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "On a scale of 1-10, how likely are you to eat something that fell on the floor? Does the 5-second rule apply?", mode: GameMode.GroupMode, type: QuestionType.Question },
    { text: "Rate your ability to lie convincingly from 1-10. Tell us a lie right now and see if we can guess!", mode: GameMode.GroupMode, type: QuestionType.Question },
];

export const WILDCARD_QUESTION: Question = {
    text: "Make up your own question!",
    mode: GameMode.FirstDate, // Mode doesn't matter for wildcard
    type: QuestionType.Wildcard,
};

export const INITIAL_WILDCARDS = 3;
