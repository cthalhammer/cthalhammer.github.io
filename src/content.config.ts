import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const titleSchema = z.string().max(60);

const baseSchema = z.object({
	title: titleSchema,
});

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
			pinned: z.boolean().default(false),
			// Climbing-specific fields
			location: z.string().optional(), // Climbing area/mountain
			region: z.string().optional(), // Country/state
			climbingType: z.enum(["sport", "trad", "alpine", "bouldering", "multipitch", "via-ferrata"]).optional(),
			difficulty: z.string().optional(), // Grade (5.9, V4, etc.)
			routes: z.array(z.object({
				name: z.string(),
				grade: z.string(),
				type: z.string().optional(),
			})).optional(),
			companions: z.array(z.string()).optional(), // Climbing partners
			duration: z.string().optional(), // Trip length
			weather: z.string().optional(),
			gear: z.array(z.string()).optional(), // Notable gear used
			highlights: z.array(z.string()).optional(), // Key achievements
		}),
});

const research = defineCollection({
	type: "content",
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			fullTitle: z.string().optional(), // Full title without character restrictions
			authors: z.array(z.string()).default([]),
			venue: z.string().optional(), // Journal/Conference name
			year: z.number(),
			type: z.enum(["publication", "preprint", "thesis"]).default("publication"),
			status: z.string().optional(), // Published, Under Review, etc.
			doi: z.string().optional(),
			arxiv: z.string().optional(),
			pdf: z.string().optional(),
			code: z.string().optional(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			pinned: z.boolean().default(false),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.datetime({ offset: true }) // Ensures ISO 8601 format with offsets allowed (e.g. "2024-01-01T00:00:00Z" and "2024-01-01T00:00:00+02:00")
			.transform((val) => new Date(val)),
	}),
});

const tag = defineCollection({
	loader: glob({ base: "./src/content/tag", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: titleSchema.optional(),
		description: z.string().optional(),
	}),
});

const teaching = defineCollection({
	type: "content",
	schema: baseSchema.extend({
		description: z.string().optional(),
		institution: z.string(),
		semester: z.string(), // e.g., "Fall", "Spring"
		year: z.number(),
		role: z.string(), // e.g., "Teaching Assistant", "Instructor", "Tutor"
		topics: z.array(z.string()).default([]),
		polyboxLink: z.string().url().optional(),
		materials: z.array(z.object({
			name: z.string(),
			url: z.string().url()
		})).default([]),
		draft: z.boolean().default(false),
		pinned: z.boolean().default(false),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
		publishDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
	}),
});

export const collections = { post, research, note, tag, teaching };
