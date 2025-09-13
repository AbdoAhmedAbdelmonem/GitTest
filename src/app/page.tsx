'use client'
import HeroGeometric from "@/components/hero-geometric"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CountUp from "@/components/CountUp"
import { BookOpen, Shield, Brain, Database, Award, Hospital, Cloud, ServerCrash, BookOpenCheck } from "lucide-react"
import CreativeFeatureSlider from "@/components/creative-feature-slider"
import ScrollAnimatedSection from "@/components/scroll-animated-section"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const specializations = [
	{
		id: "computing-data-sciences",
		icon: Cloud,
		title: "Computing and Data Sciences",
		description:
			"Comprehensive foundational courses covering essential academic subjects and critical thinking skills.",
		courses: 45,
		students: "+2k students get enrolled",
		color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
	},
	{
		id: "cybersecurity",
		icon: Shield,
		title: "Cyber Security",
		description:
			"Advanced security protocols, ethical hacking, and digital forensics to protect digital assets.",
		courses: 32,
		students: "+1.8k students get enrolled",
		color: "bg-red-500/10 text-red-400 border-red-500/20",
	},
	{
		id: "artificial-intelligence",
		icon: Brain,
		title: "Artificial Intelligence",
		description:
			"Machine learning, neural networks, and AI development for the future of technology.",
		courses: 28,
		students: "+2.0k students get enrolled",
		color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
	},
	{
		id: "media-analytics",
		icon: BookOpen,
		title: "Media Analytics",
		description:
			"Full-stack development, programming languages, and modern software engineering practices.",
		courses: 52,
		students: "+300 students get enrolled",
		color: "bg-green-500/10 text-green-400 border-green-500/20",
	},
	{
		id: "business-analytics",
		icon: Database,
		title: "Business Analytics",
		description:
			"Management, finance, marketing, and entrepreneurship for modern business growth.",
		courses: 24,
		students: "400+ students get enrolled",
		color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
	},
	{
		id: "healthcare-informatics",
		icon: Hospital,
		title: "Healthcare Informatics",
		description:
			"Global politics, diplomacy, and international affairs for comprehensive understanding.",
		courses: 18,
		students: "+200 students get enrolled",
		color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
	},
]

const stats = [
	{ icon: BookOpen, label: "Courses Available", value: "200" },
	{ icon: Award, label: "Solved Quizzes", value: "0" }, // Default value before fetching
	{ icon: BookOpenCheck, label: "Available Quizzes", value: "140+" },
	{ icon: ServerCrash, label: "Million Requests", value: "1.25M" },
]

export default function HomePage() {
	const [statsData, setStatsData] = useState(stats)

	useEffect(() => {
		async function fetchQuizData() {
			try {
				// Query Supabase to get the total count of solved quizzes
				const { count, error } = await supabase
					.from("quiz_data")
					.select("*", { count: "exact" })

				if (error) {
					console.error("Error fetching quiz data:", error)
					return
				}

				// Update the stats array with the fetched count
				if (count !== null) {
					setStatsData((prevStats) =>
						prevStats.map((stat) =>
							stat.label === "Solved Quizzes"
								? { ...stat, value: (count + 30000).toString() }
								: stat
						)
					)
				}
			} catch (error) {
				console.error("Failed to fetch quiz data:", error)
			}
		}

		fetchQuizData()
	}, [])

	return (
		<div className="min-h-screen bg-[#030303]">
			{/* Navigation */}
			<Navigation />

			{/* Hero Section - Using the exact design without changes */}
			<HeroGeometric badge="Chameleon FCDS" title1="Master Your" title2="Future Skills" />

			{/* Stats Section */}
			<ScrollAnimatedSection className="py-20 bg-[#030303] border-t border-white/5">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{statsData.map((stat, index) => (
							<ScrollAnimatedSection
								key={index}
								animation="slideUp"
								delay={index * 0.1}
								className="text-center"
							>
								<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4">
									<stat.icon className="w-6 h-6 text-white/60" />
								</div>
								<div className="text-2xl md:text-3xl font-bold text-white mb-2">
									<CountUp
										from={0}
										to={stat.value}
										separator=","
										direction="up"
										duration={1}
										className="count-up-text"
									/>
								</div>
								<div className="text-sm text-white/40">{stat.label}</div>
							</ScrollAnimatedSection>
						))}
					</div>
				</div>
			</ScrollAnimatedSection>

			{/* Creative Feature Slider */}
			<CreativeFeatureSlider />

			{/* Specializations Section */}
			<ScrollAnimatedSection
				className="py-20 bg-[#030303]"
				id="specializations"
				data-testid="specializations-section"
			>
				<div className="container mx-auto px-4">
					<ScrollAnimatedSection
						animation="fadeIn"
						className="text-center mb-16"
					>
						<Badge
							variant="outline"
							className="mb-4 bg-white/5 border-white/10 text-white/60"
						>
							Specializations
						</Badge>
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
							Choose Your{" "}
							<span style={{ color: "rgba(99, 102, 241, 1)" }}>
								Learning Path
							</span>
						</h2>
						<p className="text-lg text-white/40 max-w-2xl mx-auto">
							Explore our comprehensive specializations designed to prepare you
							for the careers of tomorrow
						</p>
					</ScrollAnimatedSection>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{specializations.map((spec, index) => {
							// Define unique colors for each card's spotlight
							const colors = [
								"rgba(14, 165, 233, 0.3)", // sky
								"rgba(236, 72, 153, 0.3)", // pink
								"rgba(99, 102, 241, 0.3)", // indigo
								"rgba(20, 184, 166, 0.3)", // teal
								"rgba(234, 179, 8, 0.3)", // yellow
								"rgba(239, 68, 68, 0.3)", // red
							]
							const spotlightColor = colors[index % colors.length]

							return (
								<ScrollAnimatedSection
									key={index}
									animation="slideInFromBottom"
									delay={index * 0.1}
									className="h-full"
								>
									<div
										className="relative h-full overflow-hidden group"
										onMouseMove={(e) => {
											const card = e.currentTarget
											const rect = card.getBoundingClientRect()
											const x = e.clientX - rect.left
											const y = e.clientY - rect.top
											card.style.setProperty("--mouse-x", `${x}px`)
											card.style.setProperty("--mouse-y", `${y}px`)
										}}
									>
										{/* Main spotlight gradient */}
										<div
											className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
											style={{
												background: `radial-gradient(
                          circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                          ${spotlightColor} 0%,
                          transparent 70%
                        )`,
											}}
										/>

										{/* Your existing card */}
										<Card className="bg-white/[0.02] border-white/10 hover:bg-white/[0.04] transition-all duration-300 h-full relative z-10">
											<CardHeader>
												<div
													className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border ${spec.color} mb-4`}
												>
													<spec.icon className="w-6 h-6" />
												</div>
												<CardTitle className="text-white text-xl mb-2">
													{spec.title}
												</CardTitle>
												<CardDescription className="text-white/40 leading-relaxed">
													{spec.description}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="flex items-center justify-between mb-4">
													<div className="flex items-center gap-4 text-sm text-white/60">
														<span>{spec.courses} Courses</span>
														<span>{spec.students} Students</span>
													</div>
												</div>
												<Link href={`/specialization/${spec.id}`}>
													<Button
														variant="outline"
														className={`w-full bg-transparent border-white/20 text-white hover:bg-white/10 group-hover:border-white/30 transition-all duration-300`}
														style={{
															color: "white",
															transition: "color 0.3s ease",
														}}
														onMouseEnter={(e) => {
															e.currentTarget.style.color = spotlightColor
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.color = "white"
														}}
													>
														Explore Courses
													</Button>
												</Link>
											</CardContent>
										</Card>
									</div>
								</ScrollAnimatedSection>
							)
						})}
					</div>
				</div>
			</ScrollAnimatedSection>

			{/* CTA Section */}
			<ScrollAnimatedSection className="py-20 bg-[#030303] border-t border-white/5">
				<div className="container mx-auto px-4 text-center">
					<ScrollAnimatedSection
						animation="scaleIn"
						className="max-w-3xl mx-auto"
					>
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
							Ready to Start Your Journey?
						</h2>
						<p className="text-lg text-white/40 mb-8 leading-relaxed">
							Join thousands of students who are already building their future
							with our expert-led courses and industry-recognized certifications.
						</p>
						<ScrollAnimatedSection animation="slideUp" delay={0.3}>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/specialization">
									<Button
										size="lg"
										className="bg-white text-black hover:bg-white/90 px-8"
									>
										Start Learning Today
									</Button>
								</Link>
								<Link href="/specialization">
									<Button
										size="lg"
										variant="outline"
										className="border-white/20 text-white hover:bg-white/10 hover:text-white px-8 bg-transparent"
									>
										View All Courses
									</Button>
								</Link>
							</div>
						</ScrollAnimatedSection>
					</ScrollAnimatedSection>
				</div>
			</ScrollAnimatedSection>

			{/* Footer */}
			<ScrollAnimatedSection
				animation="slideUp"
				className="py-12 bg-[#030303] border-t border-white/5"
			>
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-4 gap-8">
						{[
							{
								title: "Chameleon FCDS",
								content:
									"Empowering learners worldwide with cutting-edge education and industry-relevant skills.",
								isMain: true,
							},
							{
								title: "Specializations",
								items: specializations.map((spec) => ({
									name: spec.title,
									link: `/specialization/${spec.id}`,
								})),
							},
							{
								title: "Resources",
								items: [
									"Course Catalog",
									"Student Portal",
									"Career Services",
									"Certification",
								],
							},
							{
								title: "Support",
								items: ["Help Center", "Contact Us", "Community", "Blog"],
							},
						].map((section, index) => (
							<ScrollAnimatedSection
								key={index}
								animation="slideInFromLeft"
								delay={index * 0.1}
							>
								<div>
									<h3 className="text-white font-semibold mb-4">
										{section.title}
									</h3>
									{section.isMain ? (
										<p className="text-white/40 text-sm leading-relaxed">
											{section.content}
										</p>
									) : (
										<ul className="space-y-2 text-sm text-white/40">
											{section.items?.map((item, itemIndex) => (
												<li key={itemIndex}>
													{typeof item === "string" ? (
														<a
															href="#"
															className="hover:underline"
														>
															{item}
														</a>
													) : (
														<a
															href={item.link}
															className="hover:underline"
														>
															{item.name}
														</a>
													)}
												</li>
											))}
										</ul>
									)}
								</div>
							</ScrollAnimatedSection>
						))}
					</div>
					<ScrollAnimatedSection animation="fadeIn" delay={0.5}>
						<div className="border-t border-white/5 mt-8 pt-8 text-center text-sm text-white/40">
							<p className="copy">
								&copy; {new Date().getDate()} of{" "}
								{new Date().toLocaleString("default", {
									month: "long",
								})}{" "}
								{new Date().getFullYear()} - Chameleon FCDS. All rights
								reserved.
							</p>
						</div>
					</ScrollAnimatedSection>
				</div>
			</ScrollAnimatedSection>
		</div>
	)
}
