import { Request, Response } from 'express';
import { Product } from '../database/models/product';
import { VariantType } from '../database/models/variantType';
import { VariantValue } from '../database/models/variantValue';
import { VariantCombination } from '../database/models/variantCombination';

export const createFullProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      images,
      highlights,
      store,
      basePrice,
      discount,
      variantTypes, // [{ name, slug, values: [{ value, slug }] }]
      combinations  // [{ variantValues: [{ typeSlug, valueSlug }], price, stock, images }]
    } = req.body;

    // 1. Create or get Variant Types and Values
    const variantTypeIds = [];
    const variantValueMap: Record<string, string> = {}; // key: typeSlug|valueSlug, value: VariantValueId

    for (const vt of variantTypes) {
      let variantType = await VariantType.findOne({ slug: vt.slug });
      if (!variantType) {
        variantType = new VariantType({ name: vt.name, slug: vt.slug });
        await variantType.save();
      }
      variantTypeIds.push(variantType._id);

      for (const vv of vt.values) {
        let variantValue = await VariantValue.findOne({ variantType: variantType._id, slug: vv.slug });
        if (!variantValue) {
          variantValue = new VariantValue({ variantType: variantType._id, value: vv.value, slug: vv.slug });
          await variantValue.save();
        }
        variantValueMap[`${vt.slug}|${vv.slug}`] = variantValue._id.toString();
      }
    }

    

    // 2. Create Product
    const product = new Product({
      name,
      description,
      category,
      images,
      variantTypes: variantTypeIds,
      highlights,
      store,
      basePrice,
      discount
    });
    await product.save();

    // 3. Create Variant Combinations
    const createdCombinations = [];
    for (const combo of combinations) {
      // Map [{ typeSlug, valueSlug }] to VariantValue IDs
      const variantValueIds = combo.variantValues.map(
        (v: { typeSlug: string, valueSlug: string }) => variantValueMap[`${v.typeSlug}|${v.valueSlug}`]
      );
      const variantCombo = new VariantCombination({
        product: product._id,
        variantValues: variantValueIds,
        price: combo.price,
        stock: combo.stock,
        images: combo.images
      });
      await variantCombo.save();
      createdCombinations.push(variantCombo);
    }

    res.status(201).json({
      success: true,
      product,
      combinations: createdCombinations
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateFullProduct = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      name,
      description,
      category,
      images,
      highlights,
      store,
      basePrice,
      discount,
      variantTypes, // [{ name, slug, values: [{ value, slug }] }]
      combinations  // [{ variantValues: [{ typeSlug, valueSlug }], price, stock, images }]
    } = req.body;

    // 1. Update or create Variant Types and Values
    const variantTypeIds = [];
    const variantValueMap: Record<string, string> = {};

    for (const vt of variantTypes) {
      let variantType = await VariantType.findOne({ slug: vt.slug });
      if (!variantType) {
        variantType = new VariantType({ name: vt.name, slug: vt.slug });
        await variantType.save();
      } else {
        // Update name if changed
        if (variantType.name !== vt.name) {
          variantType.name = vt.name;
          await variantType.save();
        }
      }
      variantTypeIds.push(variantType._id);

      for (const vv of vt.values) {
        let variantValue = await VariantValue.findOne({ variantType: variantType._id, slug: vv.slug });
        if (!variantValue) {
          variantValue = new VariantValue({ variantType: variantType._id, value: vv.value, slug: vv.slug });
          await variantValue.save();
        } else {
          // Update value if changed
          if (variantValue.value !== vv.value) {
            variantValue.value = vv.value;
            await variantValue.save();
          }
        }
        variantValueMap[`${vt.slug}|${vv.slug}`] = variantValue._id.toString();
      }
    }

    // 2. Update Product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.name = name;
    product.description = description;
    product.category = category;
    product.images = images;
    product.variantTypes = variantTypeIds;
    product.highlights = highlights;
    product.store = store;
    product.basePrice = basePrice;
    product.discount = discount;
    await product.save();

    // 3. Remove old combinations for this product
    await VariantCombination.deleteMany({ product: product._id });

    // 4. Create new Variant Combinations
    const createdCombinations = [];
    for (const combo of combinations) {
      const variantValueIds = combo.variantValues.map(
        (v: { typeSlug: string, valueSlug: string }) => variantValueMap[`${v.typeSlug}|${v.valueSlug}`]
      );
      const variantCombo = new VariantCombination({
        product: product._id,
        variantValues: variantValueIds,
        price: combo.price,
        stock: combo.stock,
        images: combo.images
      });
      await variantCombo.save();
      createdCombinations.push(variantCombo);
    }

    res.status(200).json({
      success: true,
      product,
      combinations: createdCombinations
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};