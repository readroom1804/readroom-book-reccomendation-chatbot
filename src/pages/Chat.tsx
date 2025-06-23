import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, Send, LogOut, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  books?: any[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("readroom_current_user");
    if (!user) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(user);
    setCurrentUser(userData);

    // Load chat history
    const chatHistory = localStorage.getItem(`readroom_chat_${userData.id}`);
    if (chatHistory) {
      const parsedHistory = JSON.parse(chatHistory);
      // Convert timestamp strings back to Date objects
      const historyWithDates = parsedHistory.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(historyWithDates);
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        text: `Hi ${userData.name}! 💕 I'm your friendly book bot. Tell me about your mood, favorite genres, or authors, and I'll recommend some amazing books for you! Try saying something like "I want a happy romance book" or "Suggest some fantasy novels" ✨`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Save chat history whenever messages change
    if (currentUser && messages.length > 0) {
      localStorage.setItem(`readroom_chat_${currentUser.id}`, JSON.stringify(messages));
    }
  }, [messages, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("readroom_current_user");
    toast({
      title: "Goodbye! 👋",
      description: "Thanks for chatting about books with me!"
    });
    navigate("/");
  };

  const detectIntent = (text: string) => {
    const lowercaseText = text.toLowerCase();
    
    // Enhanced mood detection with more specific keywords
    const moods = {
      happy: ["happy", "cheerful", "uplifting", "joyful", "funny", "comedy", "light", "feel good", "positive", "humorous", "lighthearted"],
      sad: ["sad", "emotional", "cry", "tearjerker", "melancholy", "depressing", "heartbreaking", "tragic", "sorrowful"],
      romantic: ["romance", "romantic", "love", "dating", "relationship", "passion", "sweet", "love story"],
      adventurous: ["adventure", "action", "exciting", "thrilling", "quest", "journey", "epic"],
      mysterious: ["mystery", "suspense", "thriller", "detective", "crime", "puzzle", "who done it"],
      dark: ["dark", "gothic", "horror", "scary", "twisted", "psychological", "disturbing"],
      inspiring: ["inspiring", "motivational", "uplifting", "hope", "courage", "strength", "empowering"]
    };

    // Enhanced genre detection with more specific keywords
    const genres = {
      fantasy: ["fantasy", "magic", "dragons", "wizards", "supernatural", "paranormal", "fae", "witch", "magical", "enchanted"],
      romance: ["romance", "romantic", "love story", "dating", "relationship", "contemporary romance", "historical romance"],
      mystery: ["mystery", "detective", "crime", "thriller", "suspense", "whodunit", "cozy mystery", "police procedural"],
      scifi: ["sci-fi", "science fiction", "space", "future", "dystopian", "cyberpunk", "alien", "time travel"],
      horror: ["horror", "scary", "ghost", "vampire", "zombie", "haunted", "creepy", "supernatural horror"],
      historical: ["historical", "history", "period", "war", "vintage", "regency", "medieval", "victorian"],
      literary: ["literary", "classic", "literature", "philosophical", "literary fiction", "classics"],
      ya: ["young adult", "ya", "teen", "teenager", "coming of age", "high school", "young adult fiction"],
      contemporary: ["contemporary", "modern", "realistic", "slice of life", "women's fiction", "current"],
      memoir: ["memoir", "biography", "autobiography", "true story", "non-fiction", "life story"],
      selfhelp: ["self-help", "self help", "productivity", "motivation", "personal development", "improvement"],
      business: ["business", "entrepreneur", "leadership", "finance", "career", "management"]
    };

    let detectedMood = null;
    let detectedGenre = null;
    let detectedAuthor = null;

    // Check for specific authors mentioned
    const authorPatterns = [
      /by\s+([a-zA-Z\s]+)/i,
      /author\s+([a-zA-Z\s]+)/i,
      /written\s+by\s+([a-zA-Z\s]+)/i
    ];

    for (const pattern of authorPatterns) {
      const match = lowercaseText.match(pattern);
      if (match) {
        detectedAuthor = match[1].trim();
        break;
      }
    }

    // Detect mood with priority scoring
    for (const [mood, keywords] of Object.entries(moods)) {
      const matchCount = keywords.filter(keyword => lowercaseText.includes(keyword)).length;
      if (matchCount > 0) {
        detectedMood = mood;
        break;
      }
    }

    // Detect genre with priority scoring
    for (const [genre, keywords] of Object.entries(genres)) {
      const matchCount = keywords.filter(keyword => lowercaseText.includes(keyword)).length;
      if (matchCount > 0) {
        detectedGenre = genre;
        break;
      }
    }

    console.log("Detected intent:", { mood: detectedMood, genre: detectedGenre, author: detectedAuthor });
    return { mood: detectedMood, genre: detectedGenre, author: detectedAuthor };
  };

  const getBookRecommendations = (mood?: string, genre?: string, author?: string) => {
    // Comprehensive book database organized by mood and genre
    const bookDatabase = {
      happy: [
        { title: "Beach Read", author: "Emily Henry", genre: "Contemporary Romance" },
        { title: "The House in the Cerulean Sea", author: "TJ Klune", genre: "Fantasy Romance" },
        { title: "Anxious People", author: "Fredrik Backman", genre: "Literary Fiction" },
        { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman", genre: "Contemporary Fiction" },
        { title: "The Midnight Library", author: "Matt Haig", genre: "Literary Fiction" },
        { title: "Good Omens", author: "Terry Pratchett & Neil Gaiman", genre: "Fantasy Comedy" },
        { title: "The Rosie Project", author: "Graeme Simsion", genre: "Contemporary Romance" },
        { title: "A Man Called Ove", author: "Fredrik Backman", genre: "Literary Fiction" },
        { title: "The Guernsey Literary and Potato Peel Pie Society", author: "Mary Ann Shaffer", genre: "Historical Fiction" },
        { title: "Me Talk Pretty One Day", author: "David Sedaris", genre: "Humor/Memoir" },
        { title: "Yes Please", author: "Amy Poehler", genre: "Humor/Memoir" },
        { title: "Bossypants", author: "Tina Fey", genre: "Humor/Memoir" },
        { title: "The Hundred-Year-Old Man Who Climbed Out of the Window and Disappeared", author: "Jonas Jonasson", genre: "Comedy" },
        { title: "Three Men in a Boat", author: "Jerome K. Jerome", genre: "Classic Comedy" },
        { title: "Bridget Jones's Diary", author: "Helen Fielding", genre: "Romantic Comedy" }
      ],
      romantic: [
        { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", genre: "Historical Fiction" },
        { title: "It Ends with Us", author: "Colleen Hoover", genre: "Contemporary Romance" },
        { title: "The Song of Achilles", author: "Madeline Miller", genre: "Historical Fiction" },
        { title: "Pride and Prejudice", author: "Jane Austen", genre: "Classic Romance" },
        { title: "Outlander", author: "Diana Gabaldon", genre: "Historical Romance" },
        { title: "The Hating Game", author: "Sally Thorne", genre: "Contemporary Romance" },
        { title: "Red, White & Royal Blue", author: "Casey McQuiston", genre: "Contemporary Romance" },
        { title: "The Kiss Quotient", author: "Helen Hoang", genre: "Contemporary Romance" },
        { title: "People We Meet on Vacation", author: "Emily Henry", genre: "Contemporary Romance" },
        { title: "The Time Traveler's Wife", author: "Audrey Niffenegger", genre: "Science Fiction Romance" },
        { title: "Me Before You", author: "Jojo Moyes", genre: "Contemporary Romance" },
        { title: "The Notebook", author: "Nicholas Sparks", genre: "Contemporary Romance" },
        { title: "Jane Eyre", author: "Charlotte Brontë", genre: "Classic Romance" },
        { title: "Wuthering Heights", author: "Emily Brontë", genre: "Gothic Romance" },
        { title: "Sense and Sensibility", author: "Jane Austen", genre: "Classic Romance" },
        { title: "Emma", author: "Jane Austen", genre: "Classic Romance" },
        { title: "The Princess Bride", author: "William Goldman", genre: "Fantasy Romance" },
        { title: "Like Water for Chocolate", author: "Laura Esquivel", genre: "Magical Realism Romance" }
      ],
      fantasy: [
        { title: "Fourth Wing", author: "Rebecca Yarros", genre: "Fantasy Romance" },
        { title: "The Priory of the Orange Tree", author: "Samantha Shannon", genre: "Epic Fantasy" },
        { title: "The Invisible Life of Addie LaRue", author: "V.E. Schwab", genre: "Fantasy" },
        { title: "A Court of Thorns and Roses", author: "Sarah J. Maas", genre: "Fantasy Romance" },
        { title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Epic Fantasy" },
        { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "High Fantasy" },
        { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy" },
        { title: "The Way of Kings", author: "Brandon Sanderson", genre: "Epic Fantasy" },
        { title: "The Night Circus", author: "Erin Morgenstern", genre: "Magical Realism" },
        { title: "Six of Crows", author: "Leigh Bardugo", genre: "Fantasy" },
        { title: "The Poppy War", author: "R.F. Kuang", genre: "Dark Fantasy" },
        { title: "The Bear and the Nightingale", author: "Katherine Arden", genre: "Fantasy" },
        { title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", genre: "High Fantasy" },
        { title: "A Game of Thrones", author: "George R.R. Martin", genre: "Epic Fantasy" },
        { title: "The Magicians", author: "Lev Grossman", genre: "Urban Fantasy" },
        { title: "American Gods", author: "Neil Gaiman", genre: "Urban Fantasy" },
        { title: "The Dresden Files: Storm Front", author: "Jim Butcher", genre: "Urban Fantasy" },
        { title: "Mistborn: The Final Empire", author: "Brandon Sanderson", genre: "Epic Fantasy" }
      ],
      mystery: [
        { title: "The Thursday Murder Club", author: "Richard Osman", genre: "Cozy Mystery" },
        { title: "The Silent Patient", author: "Alex Michaelides", genre: "Psychological Thriller" },
        { title: "Gone Girl", author: "Gillian Flynn", genre: "Psychological Thriller" },
        { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Crime Thriller" },
        { title: "In the Woods", author: "Tana French", genre: "Mystery" },
        { title: "The Big Sleep", author: "Raymond Chandler", genre: "Detective Fiction" },
        { title: "And Then There Were None", author: "Agatha Christie", genre: "Mystery" },
        { title: "The Murder of Roger Ackroyd", author: "Agatha Christie", genre: "Mystery" },
        { title: "The Girl on the Train", author: "Paula Hawkins", genre: "Psychological Thriller" },
        { title: "Sharp Objects", author: "Gillian Flynn", genre: "Psychological Thriller" },
        { title: "Big Little Lies", author: "Liane Moriarty", genre: "Mystery" },
        { title: "The Woman in the Window", author: "A.J. Finn", genre: "Psychological Thriller" },
        { title: "The Maltese Falcon", author: "Dashiell Hammett", genre: "Detective Fiction" },
        { title: "The Cuckoo's Calling", author: "Robert Galbraith", genre: "Detective Fiction" },
        { title: "Still Life", author: "Louise Penny", genre: "Cozy Mystery" },
        { title: "The Sweetness at the Bottom of the Pie", author: "Alan Bradley", genre: "Cozy Mystery" }
      ],
      scifi: [
        { title: "Dune", author: "Frank Herbert", genre: "Science Fiction" },
        { title: "The Martian", author: "Andy Weir", genre: "Science Fiction" },
        { title: "Klara and the Sun", author: "Kazuo Ishiguro", genre: "Literary Science Fiction" },
        { title: "The Handmaid's Tale", author: "Margaret Atwood", genre: "Dystopian Fiction" },
        { title: "Station Eleven", author: "Emily St. John Mandel", genre: "Post-Apocalyptic Fiction" },
        { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", genre: "Science Fiction" },
        { title: "Neuromancer", author: "William Gibson", genre: "Cyberpunk" },
        { title: "Foundation", author: "Isaac Asimov", genre: "Science Fiction" },
        { title: "Ender's Game", author: "Orson Scott Card", genre: "Science Fiction" },
        { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", genre: "Science Fiction Comedy" },
        { title: "Ready Player One", author: "Ernest Cline", genre: "Science Fiction" },
        { title: "The Time Machine", author: "H.G. Wells", genre: "Classic Science Fiction" },
        { title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian Fiction" },
        { title: "1984", author: "George Orwell", genre: "Dystopian Fiction" },
        { title: "Fahrenheit 451", author: "Ray Bradbury", genre: "Dystopian Fiction" },
        { title: "The War of the Worlds", author: "H.G. Wells", genre: "Science Fiction" }
      ],
      horror: [
        { title: "The Haunting of Hill House", author: "Shirley Jackson", genre: "Gothic Horror" },
        { title: "Pet Sematary", author: "Stephen King", genre: "Horror" },
        { title: "The Exorcist", author: "William Peter Blatty", genre: "Horror" },
        { title: "Dracula", author: "Bram Stoker", genre: "Gothic Horror" },
        { title: "Frankenstein", author: "Mary Shelley", genre: "Gothic Horror" },
        { title: "The Shining", author: "Stephen King", genre: "Horror" },
        { title: "Something Wicked This Way Comes", author: "Ray Bradbury", genre: "Dark Fantasy" },
        { title: "The Turn of the Screw", author: "Henry James", genre: "Ghost Story" },
        { title: "World War Z", author: "Max Brooks", genre: "Horror" },
        { title: "The Silence of the Lambs", author: "Thomas Harris", genre: "Psychological Horror" },
        { title: "It", author: "Stephen King", genre: "Horror" },
        { title: "The Stand", author: "Stephen King", genre: "Post-Apocalyptic Horror" },
        { title: "Interview with the Vampire", author: "Anne Rice", genre: "Vampire Fiction" },
        { title: "The Strange Case of Dr. Jekyll and Mr. Hyde", author: "Robert Louis Stevenson", genre: "Gothic Horror" }
      ],
      historical: [
        { title: "The Book Thief", author: "Markus Zusak", genre: "Historical Fiction" },
        { title: "All Quiet on the Western Front", author: "Erich Maria Remarque", genre: "War Fiction" },
        { title: "The Pillars of the Earth", author: "Ken Follett", genre: "Historical Fiction" },
        { title: "Gone with the Wind", author: "Margaret Mitchell", genre: "Historical Fiction" },
        { title: "The Other Boleyn Girl", author: "Philippa Gregory", genre: "Historical Fiction" },
        { title: "Wolf Hall", author: "Hilary Mantel", genre: "Historical Fiction" },
        { title: "The Nightingale", author: "Kristin Hannah", genre: "Historical Fiction" },
        { title: "Memoirs of a Geisha", author: "Arthur Golden", genre: "Historical Fiction" },
        { title: "Cold Mountain", author: "Charles Frazier", genre: "Historical Fiction" },
        { title: "The Help", author: "Kathryn Stockett", genre: "Historical Fiction" },
        { title: "War and Peace", author: "Leo Tolstoy", genre: "Historical Fiction" },
        { title: "A Tale of Two Cities", author: "Charles Dickens", genre: "Historical Fiction" },
        { title: "The Things They Carried", author: "Tim O'Brien", genre: "War Fiction" },
        { title: "Beloved", author: "Toni Morrison", genre: "Historical Fiction" }
      ],
      literary: [
        { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Literary Fiction" },
        { title: "1984", author: "George Orwell", genre: "Dystopian Fiction" },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic Literature" },
        { title: "Beloved", author: "Toni Morrison", genre: "Literary Fiction" },
        { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", genre: "Magical Realism" },
        { title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Literary Fiction" },
        { title: "Atonement", author: "Ian McEwan", genre: "Literary Fiction" },
        { title: "The Kite Runner", author: "Khaled Hosseini", genre: "Literary Fiction" },
        { title: "Life of Pi", author: "Yann Martel", genre: "Literary Fiction" },
        { title: "The Color Purple", author: "Alice Walker", genre: "Literary Fiction" },
        { title: "Of Mice and Men", author: "John Steinbeck", genre: "Classic Literature" },
        { title: "The Grapes of Wrath", author: "John Steinbeck", genre: "Classic Literature" },
        { title: "Lord of the Flies", author: "William Golding", genre: "Literary Fiction" },
        { title: "Catch-22", author: "Joseph Heller", genre: "Satirical Fiction" }
      ],
      ya: [
        { title: "The Hunger Games", author: "Suzanne Collins", genre: "Young Adult Dystopian" },
        { title: "Divergent", author: "Veronica Roth", genre: "Young Adult Dystopian" },
        { title: "The Fault in Our Stars", author: "John Green", genre: "Young Adult Contemporary" },
        { title: "Percy Jackson: The Lightning Thief", author: "Rick Riordan", genre: "Young Adult Fantasy" },
        { title: "Twilight", author: "Stephenie Meyer", genre: "Young Adult Paranormal Romance" },
        { title: "The Maze Runner", author: "James Dashner", genre: "Young Adult Dystopian" },
        { title: "Miss Peregrine's Home for Peculiar Children", author: "Ransom Riggs", genre: "Young Adult Fantasy" },
        { title: "The Perks of Being a Wallflower", author: "Stephen Chbosky", genre: "Young Adult Contemporary" },
        { title: "Looking for Alaska", author: "John Green", genre: "Young Adult Contemporary" },
        { title: "Thirteen Reasons Why", author: "Jay Asher", genre: "Young Adult Contemporary" },
        { title: "The Giver", author: "Lois Lowry", genre: "Young Adult Dystopian" },
        { title: "Speak", author: "Laurie Halse Anderson", genre: "Young Adult Contemporary" },
        { title: "Wonder", author: "R.J. Palacio", genre: "Young Adult Contemporary" },
        { title: "Eleanor & Park", author: "Rainbow Rowell", genre: "Young Adult Contemporary" }
      ],
      contemporary: [
        { title: "Where the Crawdads Sing", author: "Delia Owens", genre: "Contemporary Fiction" },
        { title: "Little Fires Everywhere", author: "Celeste Ng", genre: "Contemporary Fiction" },
        { title: "The Goldfinch", author: "Donna Tartt", genre: "Contemporary Fiction" },
        { title: "Normal People", author: "Sally Rooney", genre: "Contemporary Fiction" },
        { title: "Educated", author: "Tara Westover", genre: "Memoir" },
        { title: "Becoming", author: "Michelle Obama", genre: "Memoir" },
        { title: "The Seven Moons of Maali Almeida", author: "Shehan Karunatilaka", genre: "Contemporary Fiction" },
        { title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", genre: "Contemporary Fiction" },
        { title: "The Atlas Six", author: "Olivie Blake", genre: "Dark Academia Fantasy" },
        { title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction" },
        { title: "Circe", author: "Madeline Miller", genre: "Mythology" },
        { title: "The Invisible Bridge", author: "Julie Orringer", genre: "Historical Fiction" },
        { title: "Everything I Never Told You", author: "Celeste Ng", genre: "Contemporary Fiction" },
        { title: "The Overstory", author: "Richard Powers", genre: "Literary Fiction" }
      ],
      sad: [
        { title: "A Little Life", author: "Hanya Yanagihara", genre: "Literary Fiction" },
        { title: "The Fault in Our Stars", author: "John Green", genre: "Young Adult Contemporary" },
        { title: "Me Before You", author: "Jojo Moyes", genre: "Contemporary Romance" },
        { title: "The Book Thief", author: "Markus Zusak", genre: "Historical Fiction" },
        { title: "Never Let Me Go", author: "Kazuo Ishiguro", genre: "Literary Fiction" },
        { title: "Of Mice and Men", author: "John Steinbeck", genre: "Classic Literature" },
        { title: "The Lovely Bones", author: "Alice Sebold", genre: "Literary Fiction" },
        { title: "My Sister's Keeper", author: "Jodi Picoult", genre: "Contemporary Fiction" },
        { title: "The Time Traveler's Wife", author: "Audrey Niffenegger", genre: "Science Fiction Romance" },
        { title: "One Day", author: "David Nicholls", genre: "Contemporary Fiction" },
        { title: "The Kite Runner", author: "Khaled Hosseini", genre: "Literary Fiction" },
        { title: "A Thousand Splendid Suns", author: "Khaled Hosseini", genre: "Literary Fiction" },
        { title: "The Light We Lost", author: "Jill Santopolo", genre: "Contemporary Romance" },
        { title: "Still Alice", author: "Lisa Genova", genre: "Contemporary Fiction" }
      ],
      inspiring: [
        { title: "Atomic Habits", author: "James Clear", genre: "Self-Help" },
        { title: "The Alchemist", author: "Paulo Coelho", genre: "Philosophical Fiction" },
        { title: "Educated", author: "Tara Westover", genre: "Memoir" },
        { title: "Wild", author: "Cheryl Strayed", genre: "Memoir" },
        { title: "The Power of Now", author: "Eckhart Tolle", genre: "Spirituality" },
        { title: "Becoming", author: "Michelle Obama", genre: "Memoir" },
        { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", genre: "Self-Help" },
        { title: "Man's Search for Meaning", author: "Viktor E. Frankl", genre: "Philosophy" },
        { title: "Daring Greatly", author: "Brené Brown", genre: "Self-Help" },
        { title: "The Four Agreements", author: "Don Miguel Ruiz", genre: "Self-Help" },
        { title: "Mindset", author: "Carol S. Dweck", genre: "Psychology" },
        { title: "The Gifts of Imperfection", author: "Brené Brown", genre: "Self-Help" },
        { title: "Option B", author: "Sheryl Sandberg", genre: "Self-Help" },
        { title: "Lean In", author: "Sheryl Sandberg", genre: "Leadership" }
      ],
      memoir: [
        { title: "Educated", author: "Tara Westover", genre: "Memoir" },
        { title: "Becoming", author: "Michelle Obama", genre: "Memoir" },
        { title: "Born a Crime", author: "Trevor Noah", genre: "Memoir" },
        { title: "Kitchen Confidential", author: "Anthony Bourdain", genre: "Memoir" },
        { title: "Wild", author: "Cheryl Strayed", genre: "Memoir" },
        { title: "Yes Please", author: "Amy Poehler", genre: "Memoir" },
        { title: "Bossypants", author: "Tina Fey", genre: "Memoir" },
        { title: "I Know Why the Caged Bird Sings", author: "Maya Angelou", genre: "Memoir" },
        { title: "The Glass Castle", author: "Jeannette Walls", genre: "Memoir" },
        { title: "Open", author: "Andre Agassi", genre: "Sports Memoir" },
        { title: "Just Kids", author: "Patti Smith", genre: "Memoir" },
        { title: "When Breath Becomes Air", author: "Paul Kalanithi", genre: "Memoir" },
        { title: "The Year of Magical Thinking", author: "Joan Didion", genre: "Memoir" },
        { title: "Lab Girl", author: "Hope Jahren", genre: "Science Memoir" }
      ],
      selfhelp: [
        { title: "Atomic Habits", author: "James Clear", genre: "Self-Help" },
        { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", genre: "Self-Help" },
        { title: "Daring Greatly", author: "Brené Brown", genre: "Self-Help" },
        { title: "The Four Agreements", author: "Don Miguel Ruiz", genre: "Self-Help" },
        { title: "Mindset", author: "Carol S. Dweck", genre: "Psychology" },
        { title: "The Gifts of Imperfection", author: "Brené Brown", genre: "Self-Help" },
        { title: "You Are a Badass", author: "Jen Sincero", genre: "Self-Help" },
        { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", genre: "Self-Help" },
        { title: "How to Win Friends and Influence People", author: "Dale Carnegie", genre: "Self-Help" },
        { title: "Think and Grow Rich", author: "Napoleon Hill", genre: "Self-Help" },
        { title: "The Power of Positive Thinking", author: "Norman Vincent Peale", genre: "Self-Help" },
        { title: "Girl, Wash Your Face", author: "Rachel Hollis", genre: "Self-Help" },
        { title: "Big Magic", author: "Elizabeth Gilbert", genre: "Creativity" },
        { title: "The Life-Changing Magic of Tidying Up", author: "Marie Kondo", genre: "Self-Help" }
      ],
      business: [
        { title: "Good to Great", author: "Jim Collins", genre: "Business" },
        { title: "The Lean Startup", author: "Eric Ries", genre: "Entrepreneurship" },
        { title: "Zero to One", author: "Peter Thiel", genre: "Entrepreneurship" },
        { title: "The Hard Thing About Hard Things", author: "Ben Horowitz", genre: "Business" },
        { title: "Lean In", author: "Sheryl Sandberg", genre: "Leadership" },
        { title: "The E-Myth Revisited", author: "Michael E. Gerber", genre: "Small Business" },
        { title: "Built to Last", author: "Jim Collins", genre: "Business" },
        { title: "The Innovator's Dilemma", author: "Clayton M. Christensen", genre: "Innovation" },
        { title: "Crossing the Chasm", author: "Geoffrey A. Moore", genre: "Marketing" },
        { title: "The Tipping Point", author: "Malcolm Gladwell", genre: "Business Psychology" },
        { title: "Outliers", author: "Malcolm Gladwell", genre: "Success" },
        { title: "The Art of War", author: "Sun Tzu", genre: "Strategy" },
        { title: "Blue Ocean Strategy", author: "W. Chan Kim", genre: "Strategy" },
        { title: "The $100 Startup", author: "Chris Guillebeau", genre: "Entrepreneurship" }
      ],
      default: [
        { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", genre: "Historical Fiction" },
        { title: "Where the Crawdads Sing", author: "Delia Owens", genre: "Contemporary Fiction" },
        { title: "The Midnight Library", author: "Matt Haig", genre: "Literary Fiction" },
        { title: "Educated", author: "Tara Westover", genre: "Memoir" },
        { title: "The Silent Patient", author: "Alex Michaelides", genre: "Psychological Thriller" },
        { title: "Atomic Habits", author: "James Clear", genre: "Self-Help" },
        { title: "The House in the Cerulean Sea", author: "TJ Klune", genre: "Fantasy Romance" },
        { title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction" },
        { title: "It Ends with Us", author: "Colleen Hoover", genre: "Contemporary Romance" },
        { title: "The Thursday Murder Club", author: "Richard Osman", genre: "Cozy Mystery" },
        { title: "Dune", author: "Frank Herbert", genre: "Science Fiction" },
        { title: "Normal People", author: "Sally Rooney", genre: "Contemporary Fiction" }
      ]
    };

    let selectedBooks = [];
    
    // If author is specified, search for books by that author first
    if (author) {
      const allBooks = Object.values(bookDatabase).flat();
      const authorBooks = allBooks.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase()) ||
        author.toLowerCase().includes(book.author.toLowerCase().split(' ')[0]) ||
        author.toLowerCase().includes(book.author.toLowerCase().split(' ').slice(-1)[0])
      );
      
      if (authorBooks.length > 0) {
        selectedBooks = authorBooks;
        console.log("Found books by author:", authorBooks);
      }
    }
    
    // If mood is specified and no author books found, get mood-based books
    if (selectedBooks.length === 0 && mood && bookDatabase[mood as keyof typeof bookDatabase]) {
      selectedBooks = [...bookDatabase[mood as keyof typeof bookDatabase]];
      console.log("Found books by mood:", mood, selectedBooks);
    }
    
    // If genre is specified, either filter existing results or get genre books
    if (genre && bookDatabase[genre as keyof typeof bookDatabase]) {
      const genreBooks = bookDatabase[genre as keyof typeof bookDatabase];
      
      if (selectedBooks.length > 0) {
        // Filter existing results by genre
        const genreFiltered = selectedBooks.filter(book =>
          genreBooks.some(genreBook => genreBook.title === book.title)
        );
        
        if (genreFiltered.length > 0) {
          selectedBooks = genreFiltered;
        } else {
          // If no overlap, combine mood and genre books
          selectedBooks = [...selectedBooks, ...genreBooks].slice(0, 15);
        }
      } else {
        selectedBooks = [...genreBooks];
      }
      console.log("Applied genre filter:", genre, selectedBooks);
    }
    
    // If no specific matches found, use default popular books
    if (selectedBooks.length === 0) {
      selectedBooks = bookDatabase.default;
      console.log("Using default books");
    }

    // Shuffle and return a selection
    const shuffled = selectedBooks.sort(() => 0.5 - Math.random());
    const finalSelection = shuffled.slice(0, Math.min(8, shuffled.length));
    console.log("Final selection:", finalSelection);
    
    return finalSelection;
  };

  const generateBotResponse = async (userMessage: string) => {
    const { mood, genre, author } = detectIntent(userMessage);
    
    // Get book recommendations based on detected intent
    const books = getBookRecommendations(mood, genre, author);
    
    let responseText = "";
    
    if (author) {
      const foundAuthorBooks = books.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
      if (foundAuthorBooks.length > 0) {
        responseText = `Great choice! Here are some wonderful books by ${author}:`;
      } else {
        responseText = `I couldn't find books specifically by "${author}" in my database, but here are some similar recommendations you might enjoy:`;
      }
    } else if (mood && genre) {
      responseText = `Perfect! I found some amazing ${mood} ${genre} books that will match your mood beautifully:`;
    } else if (mood) {
      responseText = `Excellent! Here are some wonderful ${mood} books that will be perfect for your current mood:`;
    } else if (genre) {
      responseText = `Great choice! ${genre.charAt(0).toUpperCase() + genre.slice(1)} is such a fantastic genre. Here are my top picks:`;
    } else {
      responseText = "I'd love to help you find the perfect book! Here are some popular recommendations that readers absolutely adore:";
    }

    return {
      text: responseText,
      books: books
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputText;
    setInputText("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(async () => {
      const botResponse = await generateBotResponse(messageToProcess);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        isBot: true,
        timestamp: new Date(),
        books: botResponse.books
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-peach-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-pink-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Book className="text-pink-500 w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-pink-600 font-serif">ReadRoom</h1>
            <p className="text-sm text-gray-600">Your personal book companion</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-pink-100 text-pink-600">
                {currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-700 font-medium">{currentUser.name}</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800 hover:bg-pink-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.isBot ? "" : "justify-end"}`}>
              {message.isBot && (
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                    <Book className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-2xl ${message.isBot ? "" : "flex flex-col items-end"}`}>
                <Card className={`p-4 ${
                  message.isBot 
                    ? "bg-white border-pink-100 shadow-sm" 
                    : "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0"
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  
                  {message.books && message.books.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {message.books.map((book, index) => (
                        <div key={index} className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded flex items-center justify-center flex-shrink-0">
                              <Book className="w-6 h-6 text-pink-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm">{book.title}</h4>
                              <p className="text-gray-600 text-xs mt-1">by {book.author}</p>
                              <span className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full mt-2">
                                {book.genre}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
                
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {!message.isBot && (
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-pink-100 text-pink-600">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                  <Book className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-white border-pink-100 shadow-sm p-4 max-w-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Sparkles className="w-4 h-4 animate-pulse text-pink-500" />
                  <span className="text-sm">ReadRoom is thinking...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-pink-100 p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about books based on your mood, genre, or favorite authors... 📚"
            className="flex-1 border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-full px-6 py-3"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full px-6 py-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
