import React, { Component } from "react";

import "../../css/CNN.css";

import VGG16 from "../../media/Cnn/vgg16-diagram.png";
import Loss1 from "../../media/Cnn/loss1.png";
import Loss2 from "../../media/Cnn/loss2.png";

class CNN extends Component {
    render() {
        return (
            <div className="CNN-Overview">
                <h1 className="Main-Title"> CNN Overview </h1>
                <hr className="Diviser" />
                <p className="Opening-Text">
                    Our initial approach to the problem of endothelial image classification was in
                    the form of a deep-learning model. Given a relatively small dataset, the most
                    reasonable strategy was to consider existing models (which are typically trained
                    on large, general-purpose datasets such as ImageNet) as the basis for a
                    transfer-learning approach. This set up a two-step approach: first, we find the
                    existing model that is the most relevant and appropriate for our specific
                    classification problem; then, we fine-tune the hyperparameters of this model to
                    extract greater prediction performance.
                </p>

                <h2 className={`Title Blue-Title`}> Model Selection </h2>
                <section className="Model-Selection">
                    <h3> Transfer Learning Approach </h3>
                    <section className="info">
                        <p>
                            The nature of deep-learning systems (i.e. their propensity for an
                            extremely large number of parameters) often limits their application to
                            problems for which there exists substantial amounts of labeled training
                            data. The problem of classifying post-DMEK endothelial images offers no
                            such affordances. Therefore an approach known as transfer learning must
                            be used to train a deep-learning model on a relatively small dataset.
                            Transfer learning involves using an existing model (such at VGG,
                            Inception, or ResNet) that has already been trained on a large dataset.
                            This provides a baseline model that already has a basic understanding of
                            the problem at hand. For example, in the case of CNNs and image
                            prediction, a pre-trained model is expected to have at least a vague
                            understanding of the shapes and colors that are associated with various
                            objects seen in photos. This baseline significantly reduces the amount
                            of data needed to train a model, as the model no longer needs to start
                            from scratch to understand images. Instead, the upper layers of the
                            pre-trained model are simply erased or adjusted, which frees up
                            parameters that can be used to learn the new training set.
                        </p>
                        <figure>
                            <img
                                id="vgg16-layers"
                                src={VGG16}
                                alt="VGG16 Layers"
                                style={{ width: "650px", height: "auto" }}
                            />
                            <figcaption>
                                Fig. 1 - VGG16 Layers
                                <span>
                                    {" "}
                                    <a
                                        href="https://neurohive.io/en/popular-networks/vgg16/"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        {" "}
                                        (Source){" "}
                                    </a>
                                </span>
                            </figcaption>
                        </figure>
                    </section>
                    <h3> Finding an Appropriate Model </h3>
                    <p>
                        Ideally the transfer-learning approach involves using an existing model that
                        was trained on an image set that resembles the image set it is being applied
                        to. In the case of endothelial image classification, a model trained on
                        cellular images would be preferable. As there was no such model of this
                        kind, we instead tested various popular ImageNet-trained CNN models in an
                        attempt to find one that favored our dataset. Although no model stood out
                        substantially, we selected VGG16 as it was among the higher-performing
                        models *and* had a relatively quick training process with our hardware
                        setup.
                    </p>
                    <p>
                        VGG16 was developed by K. Simonyan and A. Zisserman at the University of
                        Oxford. The model was designed to perform well on the ImageNet Challenge by
                        utilizing depth — i.e. more layers — more than typical models at the time.
                        The model has been found to “generalize well to other datasets”
                        <a
                            href="https://arxiv.org/pdf/1409.1556.pdf"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            (Source)
                        </a>
                        , making it ideal for our purposes.
                    </p>
                </section>

                <div className="Title-AlignRight">
                    <h2 className={`Title Blue-Title`}> Training </h2>
                </div>
                <section className="Training">
                    <h3> Layers and Weights </h3>
                    <p>
                        Training an existing model with existing weight values offers various
                        approaches. The goal is to make the most of the advantage provided by the
                        existing weight values, as this means the model is already capable of some
                        level of classification. One option is to tweak the existing layers in the
                        model (typically those towards the end of the stack) and clear their weight
                        values. Functionally, this erases some of the value provided by a
                        pre-trained model, but may be required if the model is trained to classify
                        objects that differ greatly from the dataset it is being applied to. Another
                        option is to add more layers on top, which keeps all the existing weight
                        values while also adding more trainable weight values for the new
                        classification problem.
                    </p>
                    <p>
                        Our limited dataset did not provide the luxury of making substantial changes
                        to the VGG16 layers, so we saw the highest performance when we left the
                        existing weights untouched and instead added a few custom layers on top.
                        This enabled us to take maximum advantage of the pre-trained model while
                        also minimizing the amount of parameters to be learned from our data.
                    </p>
                    <h3> Hyperparameter Tuning </h3>
                    <p>
                        With our layers set, the final step was to fine-tune the model’s
                        hyperparameters to optimize its performance on our specific dataset. This
                        process is a mix of setting reasonable initial values for the data and
                        classification goal and then iteratively modifying those initial values in
                        directions that improve performance.
                    </p>
                    <p>
                        One of the most impactful hyperparameters was dropout, which randomly clears
                        weight values during training so that a model is forced to learn more
                        features and becomes more robust in its predictions. Overfitting is always a
                        possibility when working with a small dataset, so dropout provided the
                        opportunity to minimize the model’s overfitting to the data. Figures 2 and 3
                        show differences in loss after some hyperparameter adjustments.
                    </p>
                    <section className="info">
                        <figure>
                            <img
                                id="loss"
                                src={Loss1}
                                alt="Training and validation loss"
                                style={{ width: "450px", height: "auto" }}
                            />
                            <figcaption> Fig. 2 - Training and validation loss </figcaption>
                        </figure>
                        <figure>
                            <img
                                id="loss"
                                src={Loss2}
                                alt="Training and validation loss after model adjustments"
                                style={{ width: "450px", height: "auto" }}
                            />
                            <figcaption>
                                {" "}
                                Fig. 3 - Training and validation loss after model adjustments{" "}
                            </figcaption>
                        </figure>
                    </section>
                </section>

                <h2 className={`Title Blue-Title`}> Conclusion </h2>
                <section className="Conclusion">
                    <p>
                        After various rounds of experimentation and tweaking, a point was reached
                        where the model was performing as well it reasonably could be expected to
                        for the dataset and the selected approach.
                    </p>
                    <h3> Making Useful Predictions </h3>
                    <p>
                        The CNN model makes predictions on a per-image basis, deciding whether the
                        input looks more similar to the normal or the reject images it was trained
                        on. Considering the tendency for endothelial images to have lighting
                        gradients or general artifacts, it is wise to consider the model’s output on
                        a *set* of patient images rather than just one. Providing more images and
                        reviewing the average of the results is likely to result in a more
                        comprehensive overall prediction. Multiple images also allows for the
                        ability to view predictions over time, which helps visualize whether a
                        rejection may be developing.
                    </p>
                </section>
            </div>
        );
    }
}

export default CNN;
