import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

// GET /api/bundles - Fetch all active bundles
export async function GET() {
    try {
        const bundles = await prisma.bundle.findMany({
            where: {
                isActive: true,
                OR: [
                    { validUntil: null },
                    { validUntil: { gte: new Date() } }
                ]
            },
            include: {
                BundleProduct: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                discountedPrice: true,
                                images: true,
                                stock: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ bundles })
    } catch (error) {
        console.error('Error fetching bundles:', error)
        return NextResponse.json({ error: 'Failed to fetch bundles' }, { status: 500 })
    }
}

// POST /api/bundles - Create a new bundle (seller/admin only)
export async function POST(req: Request) {
    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const role = user.publicMetadata?.role as string
        if (role !== 'seller' && role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await req.json()
        const {
            name,
            description,
            discountType,
            discountValue,
            minQuantity,
            maxQuantity,
            validUntil,
            products // Array of { productId, quantity, isRequired }
        } = body

        // Validate required fields
        if (!name || !description || !discountType || discountValue === undefined || !products?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate discountType
        if (!['percentage', 'fixed', 'buy_x_get_y'].includes(discountType)) {
            return NextResponse.json({ error: 'Invalid discount type' }, { status: 400 })
        }

        // Create bundle with products
        const bundle = await prisma.bundle.create({
            data: {
                name,
                description,
                discountType,
                discountValue,
                minQuantity: minQuantity || 1,
                maxQuantity,
                validUntil: validUntil ? new Date(validUntil) : null,
                BundleProduct: {
                    create: products.map((p: { productId: string; quantity?: number; isRequired?: boolean }) => ({
                        productId: p.productId,
                        quantity: p.quantity || 1,
                        isRequired: p.isRequired !== false
                    }))
                }
            },
            include: {
                BundleProduct: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return NextResponse.json({ bundle }, { status: 201 })
    } catch (error) {
        console.error('Error creating bundle:', error)
        return NextResponse.json({ error: 'Failed to create bundle' }, { status: 500 })
    }
}