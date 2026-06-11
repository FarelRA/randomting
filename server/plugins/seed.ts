import { db, schema } from '../utils/db'
import { count, eq, sql } from 'drizzle-orm'
import { hashPassword } from '../utils/auth'

async function createTables() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id text primary key,
      email text unique not null,
      username text not null,
      password_hash text not null,
      role text default 'user' not null,
      created_at integer not null
    )
  `)
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS presets (
      id text primary key,
      user_id text references users(id) not null,
      tool_slug text not null,
      name text not null,
      config text not null,
      created_at integer not null
    )
  `)
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS history (
      id text primary key,
      user_id text references users(id),
      tool_slug text not null,
      input text not null,
      result text not null,
      created_at integer not null
    )
  `)
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS jokes (
      id text primary key,
      content text not null,
      category text default 'general',
      source text,
      active integer default 1 not null,
      created_at integer not null
    )
  `)
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS facts (
      id text primary key,
      content text not null,
      category text default 'general',
      source text,
      active integer default 1 not null,
      created_at integer not null
    )
  `)
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id text primary key,
      content text not null,
      author text not null,
      category text default 'general',
      source text,
      active integer default 1 not null,
      created_at integer not null
    )
  `)
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS rooms (
      id text primary key,
      host_id text references users(id) not null,
      name text not null,
      tool text not null,
      config text not null,
      status text default 'waiting' not null,
      max_players integer default 10 not null,
      created_at integer not null
    )
  `)
}

async function seedTable(table: any, data: Record<string, any>[]) {
  const [row] = await db.select({ count: count() }).from(table)
  if (row.count > 0) return
  const now = Math.floor(Date.now() / 1000)
  for (const item of data) {
    await db.insert(table).values({
      id: crypto.randomUUID(),
      ...item,
      active: 1,
      createdAt: now,
    })
  }
}

async function seedAdmin() {
  const [row] = await db.select({ count: count() }).from(schema.users).where(eq(schema.users.email, 'admin@randomting.app'))
  if (row.count > 0) return
  const passwordHash = await hashPassword('admin123')
  await db.insert(schema.users).values({
    id: crypto.randomUUID(),
    username: 'admin',
    email: 'admin@randomting.app',
    passwordHash,
    role: 'admin',
    createdAt: Math.floor(Date.now() / 1000),
  })
}

export default defineNitroPlugin(async () => {
  await createTables()
  await seedAdmin()
  await seedTable(schema.jokes, [
    { content: 'Why do programmers prefer dark mode? Because light attracts bugs.', category: 'programming' },
    { content: 'A SQL query goes into a bar, walks up to two tables and asks: "Can I join you?"', category: 'programming' },
    { content: 'Why do Java developers wear glasses? Because they can\'t C#.', category: 'programming' },
    { content: 'How many programmers does it take to change a light bulb? None — that\'s a hardware problem.', category: 'programming' },
    { content: 'I don\'t trust atoms. They make up everything.', category: 'science' },
    { content: 'Why did the scarecrow win an award? Because he was outstanding in his field.', category: 'dad' },
    { content: 'What do you call a fake noodle? An impasta.', category: 'puns' },
    { content: 'Why don\'t scientists trust atoms? Because they make up everything.', category: 'science' },
    { content: 'I told my wife she was drawing her eyebrows too high. She looked surprised.', category: 'dad' },
    { content: 'What do you call a bear with no teeth? A gummy bear.', category: 'puns' },
    { content: 'Why did the bicycle fall over? Because it was two-tired.', category: 'dad' },
    { content: 'What do you call a fish wearing a bowtie? Sofishticated.', category: 'puns' },
    { content: 'Why don\'t eggs tell jokes? They\'d crack each other up.', category: 'dad' },
    { content: 'What do you call a factory that sells generally okay products? A satis-factory.', category: 'puns' },
    { content: 'Why did the golfer bring two pairs of pants? In case he got a hole in one.', category: 'dad' },
    { content: 'What do you call a snowman with a six-pack? An abdominal snowman.', category: 'puns' },
    { content: 'Why don\'t skeletons fight each other? They don\'t have the guts.', category: 'dad' },
    { content: 'What do you call a can opener that doesn\'t work? A can\'t opener.', category: 'puns' },
    { content: 'I\'m reading a book on anti-gravity. It\'s impossible to put down.', category: 'science' },
    { content: 'What do you call a belt made of watches? A waist of time.', category: 'puns' },
    { content: 'Why did the math book look so sad? It had too many problems.', category: 'dad' },
    { content: 'What do you call a boomerang that won\'t come back? A stick.', category: 'dad' },
    { content: 'Why did the coffee file a police report? It got mugged.', category: 'dad' },
    { content: 'What do you call a cow with no legs? Ground beef.', category: 'puns' },
    { content: 'Why did the music teacher go to jail? Because she got caught with the wrong pitch.', category: 'dad' },
    { content: 'What do you call a pig that does karate? A pork chop.', category: 'puns' },
    { content: 'Why did the tomato turn red? Because it saw the salad dressing.', category: 'dad' },
    { content: 'What do you call a sheep with no legs? A cloud.', category: 'puns' },
    { content: 'Why don\'t oysters donate to charity? Because they\'re shellfish.', category: 'puns' },
    { content: 'What do you call a dinosaur with an extensive vocabulary? A thesaurus.', category: 'puns' },
    { content: 'A programmer\'s wife tells him: "Go to the store and buy a loaf of bread. If they have eggs, buy twelve." He returns with twelve loaves of bread.', category: 'programming' },
    { content: 'There are only two hard things in computer science: cache invalidation and naming things.', category: 'programming' },
    { content: 'Why was the JavaScript developer sad? Because he didn\'t know how to "null" his feelings.', category: 'programming' },
    { content: 'I would tell you a joke about UDP, but you might not get it.', category: 'programming' },
    { content: 'Why did the developer go broke? Because he used up all his cache.', category: 'programming' },
    { content: 'A QA engineer walks into a bar. Orders 1 beer. Orders 0 beers. Orders 9999999 beers. Orders a lizard. Orders -1 beers. Orders a sfdeljknesv. The first real customer walks in and asks where the bathroom is. The bar bursts into flames.', category: 'programming' },
    { content: 'What\'s the object-oriented way to become wealthy? Inheritance.', category: 'programming' },
    { content: 'Why did the programmer quit his job? Because he didn\'t get arrays.', category: 'programming' },
    { content: 'How do you comfort a JavaScript bug? You console it.', category: 'programming' },
    { content: 'Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25.', category: 'programming' },
    { content: 'I invented a new word: Plagiarism.', category: 'general' },
    { content: 'What\'s the best thing about Switzerland? I don\'t know, but the flag is a big plus.', category: 'general' },
    { content: 'Why don\'t some couples go to the gym? Because some relationships don\'t work out.', category: 'general' },
    { content: 'What do you call a psychic dwarf who escapes from prison? A small medium at large.', category: 'general' },
    { content: 'Why did the man put his money in the freezer? He wanted cold, hard cash.', category: 'general' },
    { content: 'What do you call a clown who\'s also a doctor? A medical joker.', category: 'general' },
    { content: 'Why did the chicken cross the road? To get to the other side.', category: 'general' },
    { content: 'What do you call someone with no body and no nose? Nobody knows.', category: 'general' },
    { content: 'Why did the stadium get so hot? Because all the fans left.', category: 'general' },
    { content: 'What do you call a computer that sings? A Dell.', category: 'programming' },
    { content: 'Why did the web developer go to therapy? Too many trust issues with certificates.', category: 'programming' },
    { content: 'What do you call an AI that only eats candy? A sweet neural network.', category: 'programming' },
    { content: 'I\'m not arguing, I\'m just explaining why I\'m right.', category: 'general' },
    { content: 'I would agree with you, but then we\'d both be wrong.', category: 'general' },
  ])

  await seedTable(schema.facts, [
    { content: 'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.', category: 'science' },
    { content: 'Octopuses have three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body.', category: 'science' },
    { content: 'A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.', category: 'science' },
    { content: 'Bananas are berries, but strawberries are not.', category: 'science' },
    { content: 'The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion of the iron.', category: 'science' },
    { content: 'There are more possible iterations of a game of chess than there are atoms in the observable universe.', category: 'science' },
    { content: 'The human nose can remember up to 50,000 different scents.', category: 'science' },
    { content: 'A group of flamingos is called a "flamboyance."', category: 'animal' },
    { content: 'The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.', category: 'history' },
    { content: 'The Great Wall of China is not visible from space with the naked eye, contrary to popular belief.', category: 'science' },
    { content: 'Cows have best friends and can become stressed when separated from them.', category: 'animal' },
    { content: 'A jiffy is an actual unit of time: 1/100th of a second.', category: 'science' },
    { content: 'The world\'s oldest known living organism is a Great Basin bristlecone pine named Methuselah, estimated to be over 4,800 years old.', category: 'science' },
    { content: 'Octopuses can change their skin color and texture in milliseconds to blend in with their surroundings.', category: 'animal' },
    { content: 'The average person walks the equivalent of five times around the Earth in their lifetime.', category: 'science' },
    { content: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.', category: 'history' },
    { content: 'A single cloud can weigh more than a million pounds.', category: 'science' },
    { content: 'Wombat poop is cube-shaped to prevent it from rolling away, marking their territory.', category: 'animal' },
    { content: 'The brain is more active at night than during the day.', category: 'science' },
    { content: 'There are more trees on Earth than stars in the Milky Way galaxy.', category: 'science' },
    { content: 'The longest recorded flight of a chicken is 13 seconds.', category: 'animal' },
    { content: 'Honeybees can recognize human faces.', category: 'animal' },
    { content: 'The Mona Lisa has no eyebrows. It was the fashion during the Renaissance to shave them off.', category: 'history' },
    { content: 'A bolt of lightning contains enough energy to toast 100,000 slices of bread.', category: 'science' },
    { content: 'The fingerprints of a koala are so similar to humans that they can taint crime scenes.', category: 'animal' },
    { content: 'The longest wedding veil was longer than 63 football fields.', category: 'general' },
    { content: 'The first oranges weren\'t orange — they were green.', category: 'science' },
    { content: 'A chef\'s hat has 100 pleats, representing 100 ways to cook an egg.', category: 'general' },
    { content: 'The speed of a computer mouse is measured in Mickeys — the number of pixels per second it can register.', category: 'technology' },
    { content: 'The first computer virus was created in 1983 and was called the "Elk Cloner."', category: 'technology' },
    { content: 'The name "Samsung" means "three stars" in Korean.', category: 'technology' },
    { content: 'The world\'s first website is still online at info.cern.ch.', category: 'technology' },
    { content: 'The most expensive domain name ever sold is Insurance.com at $35.6 million.', category: 'technology' },
    { content: 'The first text message was sent in 1992 and simply read "Merry Christmas."', category: 'technology' },
    { content: 'Google was originally called "Backrub."', category: 'technology' },
    { content: 'The first 1GB hard drive weighed over 500 pounds and cost $40,000 in 1980.', category: 'technology' },
    { content: 'A single strand of spider silk is stronger than a steel wire of the same thickness.', category: 'science' },
    { content: 'The human body contains about 0.2 mg of gold, mostly in the blood.', category: 'science' },
    { content: 'The first recorded use of "OMG" was in a 1917 letter to Winston Churchill.', category: 'history' },
    { content: 'A crocodile cannot stick out its tongue.', category: 'animal' },
    { content: 'The national animal of Scotland is the unicorn.', category: 'general' },
    { content: 'The shortest complete sentence in English is "Go."', category: 'general' },
    { content: 'The original name for the butterfly was "flutterby."', category: 'general' },
    { content: 'There is a species of jellyfish that is biologically immortal — it can revert back to its juvenile state after reaching maturity.', category: 'science' },
    { content: 'The word "nerd" was first coined by Dr. Seuss in the 1950 book "If I Ran the Zoo."', category: 'general' },
    { content: 'A shrimp\'s heart is located in its head.', category: 'animal' },
    { content: 'The first webcam was used to monitor a coffee pot at Cambridge University in 1991.', category: 'technology' },
    { content: 'The "Like" button on Facebook was originally going to be called "Awesome."', category: 'technology' },
    { content: 'The most common password in the world is "123456".', category: 'technology' },
    { content: 'The first computer mouse was made of wood.', category: 'technology' },
    { content: 'The Earth\'s rotation is slowing down, adding about 1.8 milliseconds to a day every century.', category: 'science' },
    { content: 'The noise of a thunderclap is caused by the rapid expansion of air heated by lightning, which can reach 30,000°C.', category: 'science' },
    { content: 'There are 293 ways to make change for a dollar in US currency.', category: 'general' },
    { content: 'The largest known prime number has over 24 million digits.', category: 'science' },
    { content: 'The word "queue" is the only word in English that is still pronounced the same when the last four letters are removed.', category: 'general' },
  ])

  await seedTable(schema.quotes, [
    { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { content: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
    { content: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
    { content: 'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.', author: 'Albert Einstein' },
    { content: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
    { content: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates' },
    { content: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { content: 'The unexamined life is not worth living.', author: 'Socrates' },
    { content: 'Courage is not the absence of fear, but rather the judgment that something else is more important than fear.', author: 'Ambrose Redmoon' },
    { content: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
    { content: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu' },
    { content: 'I think, therefore I am.', author: 'René Descartes' },
    { content: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
    { content: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
    { content: 'Get busy living or get busy dying.', author: 'Stephen King' },
    { content: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky' },
    { content: 'Whether you think you can or you think you can\'t, you\'re right.', author: 'Henry Ford' },
    { content: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
    { content: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson' },
    { content: 'Creativity is intelligence having fun.', author: 'Albert Einstein' },
    { content: 'The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.', author: 'Ralph Waldo Emerson' },
    { content: 'Not all those who wander are lost.', author: 'J.R.R. Tolkien' },
    { content: 'The only thing we have to fear is fear itself.', author: 'Franklin D. Roosevelt' },
    { content: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
    { content: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
    { content: 'Be the change that you wish to see in the world.', author: 'Mahatma Gandhi' },
    { content: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { content: 'Imagination is more important than knowledge.', author: 'Albert Einstein' },
    { content: 'The best revenge is massive success.', author: 'Frank Sinatra' },
    { content: 'Life is really simple, but we insist on making it complicated.', author: 'Confucius' },
    { content: 'To be or not to be, that is the question.', author: 'William Shakespeare' },
    { content: 'All that glitters is not gold.', author: 'William Shakespeare' },
    { content: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt' },
    { content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', author: 'Nelson Mandela' },
    { content: 'In the end, it\'s not the years in your life that count. It\'s the life in your years.', author: 'Abraham Lincoln' },
    { content: 'Many of life\'s failures are people who did not realize how close they were to success when they gave up.', author: 'Thomas Edison' },
    { content: 'If you want to lift yourself up, lift up someone else.', author: 'Booker T. Washington' },
    { content: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.', author: 'Thomas Edison' },
    { content: 'A person who never made a mistake never tried anything new.', author: 'Albert Einstein' },
    { content: 'The mind is everything. What you think you become.', author: 'Buddha' },
    { content: 'The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.', author: 'Helen Keller' },
    { content: 'It is better to be hated for what you are than to be loved for what you are not.', author: 'André Gide' },
    { content: 'We know what we are, but know not what we may be.', author: 'William Shakespeare' },
    { content: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson' },
    { content: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair' },
    { content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
    { content: 'The greatest wealth is to live content with little.', author: 'Plato' },
    { content: 'Happiness is not something ready made. It comes from your own actions.', author: 'Dalai Lama' },
    { content: 'The only way to have a friend is to be one.', author: 'Ralph Waldo Emerson' },
    { content: 'What we achieve inwardly will change outer reality.', author: 'Plutarch' },
    { content: 'Perfection is not attainable, but if we chase perfection we can catch excellence.', author: 'Vince Lombardi' },
    { content: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
    { content: 'The function of education is to teach one to think intensively and to think critically.', author: 'Martin Luther King Jr.' },
    { content: 'Intelligence plus character — that is the goal of true education.', author: 'Martin Luther King Jr.' },
    { content: 'Without music, life would be a mistake.', author: 'Friedrich Nietzsche' },
  ])
})
