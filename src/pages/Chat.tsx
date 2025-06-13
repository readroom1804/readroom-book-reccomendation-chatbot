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
      setMessages(JSON.parse(chatHistory));
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
    
    // Mood detection
    const moods = {
      happy: ["happy", "cheerful", "uplifting", "joyful", "funny", "comedy", "light", "feel good", "positive"],
      sad: ["sad", "emotional", "cry", "tearjerker", "melancholy", "depressing", "heartbreaking"],
      romantic: ["romance", "romantic", "love", "dating", "relationship", "passion", "sweet"],
      adventurous: ["adventure", "action", "exciting", "thrilling", "quest", "journey"],
      mysterious: ["mystery", "suspense", "thriller", "detective", "crime", "puzzle"],
      fantasy: ["fantasy", "magic", "dragons", "wizards", "supernatural", "mythical"],
      scifi: ["sci-fi", "science fiction", "space", "future", "technology", "dystopian"],
      dark: ["dark", "gothic", "horror", "scary", "twisted", "psychological"],
      inspiring: ["inspiring", "motivational", "uplifting", "hope", "courage", "strength"]
    };

    // Genre detection
    const genres = {
      fantasy: ["fantasy", "magic", "dragons", "wizards", "supernatural", "paranormal", "fae", "witch"],
      romance: ["romance", "romantic", "love story", "dating", "relationship", "contemporary romance"],
      mystery: ["mystery", "detective", "crime", "thriller", "suspense", "whodunit", "cozy mystery"],
      scifi: ["sci-fi", "science fiction", "space", "future", "dystopian", "cyberpunk", "alien"],
      horror: ["horror", "scary", "ghost", "vampire", "zombie", "haunted", "creepy"],
      historical: ["historical", "history", "period", "war", "vintage", "regency", "medieval"],
      literary: ["literary", "classic", "literature", "philosophical", "literary fiction"],
      ya: ["young adult", "ya", "teen", "teenager", "coming of age", "high school"],
      contemporary: ["contemporary", "modern", "realistic", "slice of life", "women's fiction"],
      memoir: ["memoir", "biography", "autobiography", "true story", "non-fiction"],
      selfhelp: ["self-help", "self help", "productivity", "motivation", "personal development"],
      business: ["business", "entrepreneur", "leadership", "finance", "career"],
      cooking: ["cooking", "recipe", "food", "chef", "culinary"]
    };

    let detectedMood = null;
    let detectedGenre = null;

    for (const [mood, keywords] of Object.entries(moods)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        detectedMood = mood;
        break;
      }
    }

    for (const [genre, keywords] of Object.entries(genres)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        detectedGenre = genre;
        break;
      }
    }

    return { mood: detectedMood, genre: detectedGenre };
  };

  const getFallbackBooks = (mood?: string, genre?: string) => {
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
        { title: "Me Talk Pretty One Day", author: "David Sedaris", genre: "Humor/Memoir" }
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
        { title: "The Notebook", author: "Nicholas Sparks", genre: "Contemporary Romance" }
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
        { title: "The Bear and the Nightingale", author: "Katherine Arden", genre: "Fantasy" }
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
        { title: "The Woman in the Window", author: "A.J. Finn", genre: "Psychological Thriller" }
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
        { title: "The Time Machine", author: "H.G. Wells", genre: "Classic Science Fiction" }
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
        { title: "The Silence of the Lambs", author: "Thomas Harris", genre: "Psychological Horror" }
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
        { title: "The Help", author: "Kathryn Stockett", genre: "Historical Fiction" }
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
        { title: "The Color Purple", author: "Alice Walker", genre: "Literary Fiction" }
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
        { title: "Thirteen Reasons Why", author: "Jay Asher", genre: "Young Adult Contemporary" }
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
        { title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction" }
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
        { title: "One Day", author: "David Nicholls", genre: "Contemporary Fiction" }
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
        { title: "The Four Agreements", author: "Don Miguel Ruiz", genre: "Self-Help" }
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
        { title: "Open", author: "Andre Agassi", genre: "Sports Memoir" }
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
    
    if (mood && bookDatabase[mood as keyof typeof bookDatabase]) {
      selectedBooks = [...bookDatabase[mood as keyof typeof bookDatabase]];
    }
    
    if (genre && bookDatabase[genre as keyof typeof bookDatabase]) {
      const genreBooks = bookDatabase[genre as keyof typeof bookDatabase];
      selectedBooks = selectedBooks.length > 0 ? 
        [...selectedBooks, ...genreBooks].slice(0, 15) : 
        [...genreBooks];
    }
    
    if (selectedBooks.length === 0) {
      selectedBooks = bookDatabase.default;
    }

    // Shuffle and return a random selection
    const shuffled = selectedBooks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(8, shuffled.length));
  };

  const generateBotResponse = async (userMessage: string) => {
    const { mood, genre } = detectIntent(userMessage);
    
    // Get fallback books (in a real app, you'd also try API calls here)
    const books = getFallbackBooks(mood, genre);
    
    let responseText = "";
    
    if (mood && genre) {
      responseText = `I love that you're looking for ${mood} ${genre} books! Here are some perfect recommendations for you:`;
    } else if (mood) {
      responseText = `Perfect! I have some wonderful ${mood} books that will match your mood beautifully:`;
    } else if (genre) {
      responseText = `Excellent choice! ${genre.charAt(0).toUpperCase() + genre.slice(1)} is such a fantastic genre. Here are my top picks:`;
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
    setInputText("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(async () => {
      const botResponse = await generateBotResponse(inputText);
      
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
