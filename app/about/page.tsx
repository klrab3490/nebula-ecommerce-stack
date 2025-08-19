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
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-6 ring-2 ring-green-200 dark:ring-green-800">
                        <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">About Our Journey</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Discover the story behind our commitment to pure, natural herbal care
                    </p>
                </div>

                {/* Language Tabs */}
                <Tabs defaultValue="english" className="w-full">
                    <TabsList className="flex w-full justify-center gap-4 mb-8 bg-gradient-to-r from-green-100/60 via-emerald-100/40 to-teal-100/60 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/60 backdrop-blur-sm border dark:border-gray-700 rounded-xl p-2 shadow-sm">
                        <TabsTrigger
                            value="english"
                            className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-700 dark:data-[state=active]:text-white hover:bg-green-100 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            English
                        </TabsTrigger>
                        <TabsTrigger
                            value="malayalam"
                            className="flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-700 dark:data-[state=active]:text-white hover:bg-green-100 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            മലയാളം
                        </TabsTrigger>
                    </TabsList>

                    {/* English Content */}
                    <TabsContent value="english" className="space-y-8">
                        <div className="grid gap-8">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 ring-2 ring-green-200/50 dark:ring-green-800/50">
                                            {section.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">{section.title}</h2>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{section.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Malayalam Content */}
                    <TabsContent value="malayalam" className="space-y-8">
                        <div className="grid gap-8">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 ring-2 ring-green-200/50 dark:ring-green-800/50">
                                            {section.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">{section.titleMl}</h2>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{section.contentMl}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Call to Action */}
                <div className="mt-16 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">Experience the Power of Nature</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who have discovered the benefits of pure, authentic herbal care.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
                            <Leaf className="w-5 h-5" />
                            <span className="font-medium">100% Natural</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
                            <Heart className="w-5 h-5" />
                            <span className="font-medium">Safe & Effective</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
                            <Award className="w-5 h-5" />
                            <span className="font-medium">Trusted Quality</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
