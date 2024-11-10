import { CatalogSearch } from "src/layout/header/CatalogSearch";

export function Component() {
	return (
		<CatalogSearch
			catalogItems={[
				{
					id: "1",
					rating: 1,
					discount: null,
					creditInfo: null,
					createdAt: new Date(),
					variationIndex: 0,
					preorder: null,
					publicationLink: "123",
					shippingCostIncluded: null,
					product: {
						description: "description",
						title: "Space Marine Heroes: Blood Angels Collection Two. Space Marine Heroes: Blood Angels Collection Two. Space Marine Heroes",
						category: {
							id: "123123123123123123123",
							title: "123123123123123123123",
							link: "123123123123123123123",
							icon: {
								index: 0,
								url: "123123123123123123123",
							},
							banner: {
								index: 0,
								url: "123123123123123123123",
							},
						},
						filterGroups: [],
						physicalProperties: {
							width: 1,
							height: 1,
							length: 1,
							weight: 1,
						},
						images: [],
					},
					price: 1,
				},
                {
					id: "2",
					rating: 1,
					discount: null,
					creditInfo: null,
					createdAt: new Date(),
					variationIndex: 0,
					preorder: null,
					publicationLink: "123",
					shippingCostIncluded: null,
					product: {
						description: "description",
						title: "Space ",
						category: {
							id: "123123123123123123123",
							title: "123123123123123123123",
							link: "123123123123123123123",
							icon: {
								index: 0,
								url: "123123123123123123123",
							},
							banner: {
								index: 0,
								url: "123123123123123123123",
							},
						},
						filterGroups: [],
						physicalProperties: {
							width: 1,
							height: 1,
							length: 1,
							weight: 1,
						},
						images: [],
					},
					price: 1,
				},
                {
					id: "3",
					rating: 1,
					discount: null,
					creditInfo: null,
					createdAt: new Date(),
					variationIndex: 0,
					preorder: null,
					publicationLink: "123",
					shippingCostIncluded: null,
					product: {
						description: "description",
						title: "Space asdasd",
						category: {
							id: "123123123123123123123",
							title: "123123123123123123123",
							link: "123123123123123123123",
							icon: {
								index: 0,
								url: "123123123123123123123",
							},
							banner: {
								index: 0,
								url: "123123123123123123123",
							},
						},
						filterGroups: [],
						physicalProperties: {
							width: 1,
							height: 1,
							length: 1,
							weight: 1,
						},
						images: [],
					},
					price: 1,
				},
			]}
		/>
	);
}
