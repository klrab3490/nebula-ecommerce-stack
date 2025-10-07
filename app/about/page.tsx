import React from "react";
import { Leaf, Heart, Award, Users, Clock, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function About() {
    const sections = [
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Our Journey",
            titleMl: "ഞങ്ങളുടെ യാത്ര",
            content:
                "Founded in 2005, our story began at home — crafting pure herbal products and delivering them door-to-door with love and dedication. From these humble beginnings, we have grown into a trusted name for safe, natural beauty solutions.",
            contentMl:
                "2005-ൽ വീട്ടിൽ ഉണ്ടാക്കിയ ഹെർബൽ പ്രോഡക്റ്റുകൾ ഡോർ-ടു-ഡോർ ആയി നൽകി തുടങ്ങിയതാണ് ഞങ്ങളുടെ യാത്രയുടെ തുടക്കം. ഇങ്ങനെ ചെറിയ തുടക്കത്തിൽ നിന്ന് ഇന്ന് സുരക്ഷിതവും വിശ്വസനീയവുമായ സൗന്ദര്യസംരക്ഷണത്തിനുള്ള ഒരു വിശ്വസ്ത ബ്രാൻഡായി വളർന്നു.",
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Our Vision",
            titleMl: "ഞങ്ങളുടെ ദർശനം",
            content:
                "To help people move away from harmful chemical-based products and embrace the safe, effective power of herbal care — preserving beauty naturally for generations to come.",
            contentMl:
                "അപകടകരമായ കെമിക്കൽ ചേർന്ന ഉൽപ്പന്നങ്ങളിൽ നിന്ന് ആളുകളെ മാറ്റി, സുരക്ഷിതവും ഫലപ്രദവുമായ ഹെർബൽ കെയർ സ്വീകരിക്കാനുള്ള പ്രചോദനം നൽകുക — ഇങ്ങനെ തലമുറകളായി സൗന്ദര്യം സംരക്ഷിക്കുക.",
        },
        {
            icon: <Leaf className="w-6 h-6" />,
            title: "Our Heritage",
            titleMl: "ഞങ്ങളുടെ പാരമ്പര്യം",
            content:
                "Our roots go deep into a lineage of traditional healers — my mother's father and his father were renowned Ayurvedic physicians. This heritage inspires every product we create.",
            contentMl:
                "എന്റെ അമ്മയുടെ അച്ഛനും, അദ്ദേഹത്തിന്റെ അച്ഛനും പേരുകേട്ട ആയുർവേദ വൈദ്യൻമാരായിരുന്നു. ഈ പാരമ്പര്യമാണ് ഇന്നത്തെ ഓരോ ഉൽപ്പന്നത്തിലും പ്രചോദനമായി പ്രവർത്തിക്കുന്നത്.",
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Our Inspiration",
            titleMl: "എന്റെ പ്രചോദനം",
            content:
                "Years ago, when I faced a health challenge, Ayurvedic treatment brought me complete relief. Since then, I have only used and trusted herbal products. My passion grew when I realised that while many people wish to switch to herbal care, pure and genuine products are not easily available. I wanted to change that.",
            contentMl:
                "ഒരിക്കൽ എനിക്ക് വാതരോഗം വന്നപ്പോൾ ആയുർവേദ ചികിത്സയിലൂടെ പൂർണ്ണമായി മാറി. അതിനു ശേഷം ഞാൻ ഹെർബൽ ഉൽപ്പന്നങ്ങൾ മാത്രമാണ് വിശ്വസിക്കുകയും ഉപയോഗിക്കുകയും ചെയ്തത്. പലർക്കും ഹെർബൽ ഉൽപ്പന്നങ്ങൾ ഉപയോഗിക്കാൻ ആഗ്രഹമുണ്ടെങ്കിലും, വിശ്വസനീയമായ ഉൽപ്പന്നങ്ങൾ ലഭ്യമാകുന്നില്ലെന്ന കാര്യം മനസ്സിലാക്കി, കൂടുതൽ ആളുകൾക്ക് ഹെർബൽ ഉൽപ്പന്നങ്ങൾ ലഭ്യമാക്കണമെന്ന ആഗ്രഹത്തോടെ ഈ യാത്ര തുടങ്ങി.",
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "Our Recognition",
            titleMl: "ഞങ്ങളുടെ അംഗീകാരം",
            content:
                "Our dedication to authentic herbal care was recognised when Manorama Sampadyam magazine featured an interview about our products in September 2020.",
            contentMl:
                "2020 സെപ്റ്റംബറിൽ, മനോരമ സമ്പാദ്യം മാസികയിൽ ഞങ്ങളുടെ പ്രോഡക്റ്റുകളെക്കുറിച്ച് ഒരു അഭിമുഖം പ്രസിദ്ധീകരിച്ചു, നമ്മുടെ പരിശ്രമത്തെ അംഗീകരിച്ച്.",
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Why People Love Us",
            titleMl: "എന്തുകൊണ്ട് എല്ലാവരും ഇഷ്ടപ്പെടുന്നു",
            content:
                "Almost every customer who tries our products becomes a regular, thanks to their visible results and safety. We believe in creating products that you can trust, with no compromise on quality or purity.",
            contentMl:
                "ഞങ്ങളുടെ ഉൽപ്പന്നങ്ങൾ പരീക്ഷിക്കുന്നവർ ഭൂരിഭാഗവും സ്ഥിര ഉപഭോക്താക്കളാകുന്നു, കാരണം ഇവ സുരക്ഷിതവും ഫലപ്രദവുമായിരിക്കുന്നു. ഗുണമേന്മയിലും ശുദ്ധിയിലും ഒരിക്കലും വിട്ടുവീഴ്ച ചെയ്യാത്ത ഉൽപ്പന്നങ്ങളാണ് ഞങ്ങൾ ഒരുക്കുന്നത്.",
        },
    ]

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Modern Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
                {/* Enhanced Hero Section */}
                <div className="text-center mb-16">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                        <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full p-5">
                            <Leaf className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                        🌿 About Our Journey
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                        Discover the story behind our commitment to pure, natural herbal care and wellness
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Enhanced Language Tabs */}
                <Tabs defaultValue="english" className="w-full">
                    <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl p-2 mb-12">
                        <TabsList className="flex w-full justify-center gap-4 bg-transparent">
                            <TabsTrigger
                                value="english"
                                className="flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white hover:bg-white/20 focus:outline-none"
                            >
                                🇺🇸 English
                            </TabsTrigger>
                            <TabsTrigger
                                value="malayalam"
                                className="flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white hover:bg-white/20 focus:outline-none"
                            >
                                🇮🇳 മലയാളം
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Enhanced English Content */}
                    <TabsContent value="english" className="space-y-8">
                        <div className="grid gap-8">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                                    
                                    {/* Main Card */}
                                    <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-white/30 dark:border-zinc-700/50 group-hover:bg-white/90 dark:group-hover:bg-zinc-900/90">
                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl"></div>
                                        
                                        <div className="flex items-start gap-6 relative z-10">
                                            <div className="flex-shrink-0 relative">
                                                <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                    {section.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-black mb-4 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                                    {section.title}
                                                </h2>
                                                <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                                                    {section.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Enhanced Malayalam Content */}
                    <TabsContent value="malayalam" className="space-y-8">
                        <div className="grid gap-8">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                                    
                                    {/* Main Card */}
                                    <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-white/30 dark:border-zinc-700/50 group-hover:bg-white/90 dark:group-hover:bg-zinc-900/90">
                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-3xl"></div>
                                        
                                        <div className="flex items-start gap-6 relative z-10">
                                            <div className="flex-shrink-0 relative">
                                                <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                    {section.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-black mb-4 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                                    {section.titleMl}
                                                </h2>
                                                <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                                                    {section.contentMl}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Enhanced Call to Action */}
                <div className="mt-20 text-center relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 animate-pulse"></div>
                    
                    {/* Main Card */}
                    <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 dark:border-zinc-700/50">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-3xl opacity-50"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                ✨ Experience the Power of Nature
                            </h3>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                                Join thousands of satisfied customers who have discovered the benefits of pure, authentic herbal care.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                                    <Leaf className="w-6 h-6" />
                                    <span>100% Natural</span>
                                </div>
                                <div className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                                    <Heart className="w-6 h-6" />
                                    <span>Safe & Effective</span>
                                </div>
                                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                                    <Award className="w-6 h-6" />
                                    <span>Trusted Quality</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
